'use strict';

var path = require('path');
var passport = require('passport');
var crypto = require('crypto');
var Word = require('./models/word');
var User = require('./models/user');
var Sentence = require('./models/sentence');
var autofill = require('./autofill');
var bulkAdd = require('./bulkAdd');
var search = require('./search');
var email = require('./email');
var stats = require('./stats');

module.exports = addRoutes;

function addRoutes(app) {
	addRoutesForWords(app);
	addRoutesForUser(app);
	addRoutesForSearch(app);
	addRoutesForAutofill(app);
	addRoutesForBulkAdd(app);
	addRoutesForStats(app);
	addRoutesForSentences(app);

	app.get('(?!/api/)*', function(req, res) {
		res.sendFile(path.resolve(__dirname, '../public/index.html'));
	});
}

function updateWordFromReq(word, req) {
	word.orcish = req.body.orcish;
	word.english = req.body.english;
	word.PoS = req.body.PoS;
	addIfExists(word, req, 'extraInfo');
	addIfExists(word, req, 'coinedBy');
	addIfExists(word, req, 'namedAfter');
	addIfExists(word, req, 'relatedWords');
	addIfExists(word, req, 'keywords');
	addIfExists(word, req, 'adjective');
	addIfExists(word, req, 'noun');
	addIfExists(word, req, 'verb');
	addIfExists(word, req, 'pronoun');
	addIfExists(word, req, 'affix');
}

function addIfExists(word, req, property) {
	if (req.body[property]) {
		word[property] = req.body[property];
	}
}

function getBetterErrorMessage(error) {
	var msg = error.message + ': ';
	if (error.errors) {
		for (let errorPart in error.errors) {
			let partMsg = error.errors[errorPart].message;
			msg += partMsg + ' ';
		}
	}
	return msg;
}

function rebuild() {
	var start = process.hrtime();
	search.rebuild()
	.then(function(data) {
		var total = process.hrtime(start);
		var ms = total[1] / 1000000;
		if (process.env.NODE_ENV !== 'test') {
			console.log('Search.rebuild took ' + ms + ' ms');
		}
	})
	.catch(function(error) {
		console.log('Error with search.rebuild:');
		console.log(error.message);
	});
}

function addRoutesForWords(app) {
	app.get('/api/words', function(req, res) {
		var resQuery = req.query || {};
		var sort = resQuery.sort;
		var skip = Number(resQuery.skip);
		var limit = Number(resQuery.limit);
		var getcount = resQuery.getcount;
		var pos = resQuery.pos;
		var query = Word.find({}).select({
			orcish: 1,
			english: 1,
			PoS: 1,
			num: 1
		});
		if (sort) {
			query = query.sort(sort);
		}
		if (skip) {
			query = query.skip(skip);
		}
		if (limit) {
			query = query.limit(limit);
		}
		if (pos) {
			query = query.where('PoS', pos);
		}
		var promises = [query.exec()];
		if (getcount) {
			if (pos) {
				promises.push(Word.count().where('PoS', pos).exec());
			} else {
				promises.push(Word.count({}).exec());
			}
		}
		Promise.all(promises)
		.then(function(values) {
			var data = {
				words: values[0]
			};
			if (values[1]) {
				data.count = values[1];
			}
			res.setHeader('Cache-Control', 'no-cache');
			res.json(data);
		}, function(error) {
			res.status(500).send(error.message);
		});
	});

	app.post('/api/words', function(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).send('Unauthorized');
		} else {
			var newWord = new Word();
			updateWordFromReq(newWord, req);
			newWord.save(function(err) {
				if (err) {
					res.status(500).send(getBetterErrorMessage(err));
				} else {
					res.json(newWord);
					search.forCreate(newWord)
					.catch(function(error) {
						console.log('error with search.forCreate:');
						console.log(error);
					});
				}
			});
		}
	});

	app.get('/api/words/:orcish/:num', function(req, res) {
		Word.findOne({
			'orcish': req.params.orcish,
			'num': req.params.num
		}, function(err, word) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				if (!word) {
					var wordStr = req.params.orcish + ' ' + req.params.num;
					res.status(404).send(
						'cannot find word: ' + wordStr
					);
				} else {
					res.setHeader('Cache-Control', 'no-cache');
					res.json(word);
				}
			}
		});
	});

	app.put('/api/words/:orcish/:num', function(req, res) {
		if (!req.isAuthenticated()) {
			return res.status(401).send('Unauthorized');
		} else {
			Word.findOne({
				'orcish': req.params.orcish,
				'num': req.params.num
			}, function(err, word) {
				if (err) {
					return res.status(500).send(err.message);
				}
				word = word || new Word();
				updateWordFromReq(word, req);
				if (req.params.orcish !== word.orcish) {
					word.num = undefined;
				}
				word.save(function(err) {
					if (err) {
						res.status(500).send(getBetterErrorMessage(err));
					} else {
						res.json(word);
						search.forUpdate(
							req.params.orcish,
							req.params.num,
							word
						).catch(function(error) {
							console.log('error with search.forUpdate:');
							console.log(error);
						});
					}
				});
			});
		}
	});

	app.delete('/api/words/:orcish/:num', function(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).send('Unauthorized');
		} else {
			Word.findOneAndRemove({
				'orcish': req.params.orcish,
				'num': req.params.num
			}, function (err, word) {
				if (err) {
					res.status(500).send(err.message);
				} else if (!word) {
					var wordStr = req.params.orcish + ' ' + req.params.num;
					res.status(404).send('word ' + wordStr + ' does not exits');
				} else {
					res.json(word);
					search.forRemove(word)
					.catch(function(error) {
						console.log('error with search.forRemove:');
						console.log(error);
					});
				}
			});
		}
	});

	app.delete('/api/words-by-pos/:pos', function(req, res) {
		var PoS = req.params.pos;
		var query;
		if (PoS === 'all') {
			query = Word.remove({});
		} else {
			let enums = Word.schema.path('PoS').enumValues;
			if (Word.schema.path('PoS').enumValues.indexOf(PoS) !== -1) {
				query = Word.remove({
					PoS: PoS
				});
			} else {
				return res.status(400).send('Invalid PoS ' + PoS);
			}
		}
		query.exec()
		.then(function(result) {
			return res.json(result);
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});
}

function addRoutesForUser(app) {
	app.post('/api/user/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).send(info.message);
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).send(err.message);
				}
				res.status(200).json({
					status: 'Login successful'
				});
			});
		})(req, res, next);
	});

	app.post('/api/user/logout', function(req, res) {
		req.logout();
		res.json({
			status: 'Logout success'
		});
	});

	app.get('/api/user/status', function(req, res) {
		if (req.isAuthenticated()) {
			return res.status(200).json({
				status: true,
				username: req.user.username
			});
		} else {
			return res.status(200).json({
				status: false
			});
		}
	});

	app.post('/api/user/forgot', function(req, res) {
		var token;

		new Promise(function(resolve, reject) {
			crypto.randomBytes(20, function(err, buf) {
				if (err) {
					reject(err);
				} else {
					resolve(buf.toString('hex'));
				}
			});
		})
		.then(function(data) {
			token = data;
			return User.findOne({
				email: req.body.email
			}).exec();
		})
		.then(function(user) {
			if (!user) {
				throw 'No account with that email address exists';
			}

			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 3600000;
			return user.save();
		})
		.then(function(user) {
			return email.sendReset(user.email, token, req.headers.host);
		})
		.then(function(response) {
			res.send('Reset email successfully sent');
		})
		.catch(function(error) {
			console.log(error);
			res.status(500).send(error.message);
		});
	});

	app.post('/api/user/reset/', function(req, res) {
		var token = req.body.token;
		var password = req.body.password;

		User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: {
				$gt: Date.now()
			}
		}).exec()
		.then(function(user) {
			if (!user) {
				throw 'Password reset token is invalid or has expired';
			} else {
				user.password = password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				return user.save();
			}
		})
		.then(function(user) {
			return res.send('Password successfully reset');
		})
		.catch(function(error) {
			var message = error.message || error;
			return res.status(400).send(message);
		});
	});

	app.post('/api/csrftest', function(req, res) {
		res.json({ message: 'CSRF test success' });
	});
}

function addRoutesForSearch(app) {
	app.get('/api/search', function(req, res) {
		var query = req.query || {};
		var q = query.q;
		if (!q) {
			return res.status(400).send('missing query paramerter q');
		}

		search.getMatches(q)
		.then(function(data) {
			res.json({
				results: data
			});
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.post('/api/search/rebuild', function(req, res) {
		search.rebuild()
		.catch(function(error) {
			console.log('error with search.rebuild');
			console.log(error);
		});
		res.send('Search Indexes are now being rebuilt');
	});

	app.get('/api/list-search-indexes', function(req, res) {
		search.getAll(function(error, data) {
			if (error) {
				res.status(500).send(error.message);
			} else {
				res.send(data);
			}
		});
	});
}

function addRoutesForAutofill(app) {
	app.get('/api/autofillword/:PoS/:orcish', function(req, res) {
		var PoS = req.params.PoS;
		var orcish = req.params.orcish;
		autofill(orcish, PoS, function(err, wordPart) {
			if (err) {
				res.status(404).send(err.message);
			} else {
				res.json(wordPart);
			}
		});
	});
}

function addRoutesForBulkAdd(app) {
	app.post('/api/bulkadd', function(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).send('Unauthorized');
		} else {
			var data = req.body.data;
			var encoding = req.body.encoding;
			var updateMethod = req.body.updateMethod;
			var order = req.body.order;
			bulkAdd(data, encoding, updateMethod, order)
			.then(function(results) {
				res.json(results);
			})
			.catch(function(error) {
				res.status(404).send(getBetterErrorMessage(error));
			});
		}
	});
}

function addRoutesForStats(app) {
	app.post('/api/stats', function(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).send('Unauthorized');
		} else {
			stats.get()
			.then(function(stats) {
				res.json(stats);
			})
			.catch(function(error) {
				res.status(500).send(error.message);
			});
		}
	});
}

function addRoutesForSentences(app) {
	app.get('/api/sentences/', function(req, res) {
		req.query = req.query || {};
		var sort = req.query.sort;
		var skip = Number(req.query.skip);
		var limit = Number(req.query.limit);
		var getcount = req.query.getcount;
		var getcategories = req.query.getcategories;
		var category = req.query.category;

		var query = Sentence.find({});
		if (sort) {
			query = query.sort(sort);
		}
		if (skip) {
			query = query.skip(skip);
		}
		if (limit) {
			query = query.limit(limit);
		}
		if (category) {
			query = query.where('category', category);
		}

		var promises = [query.exec()];
		if (getcategories) {
			promises.push(Sentence.distinct('category').exec());
		} else {
			promises.push(Promise.resolve(undefined));
		}
		if (getcount) {
			if (category) {
				promises.push(
					Sentence.count().where('category', category).exec()
				);
			} else {
				promises.push(Sentence.count({}).exec());
			}
		}

		Promise.all(promises)
		.then(function(results) {
			var sentences = results[0];
			var categories = results[1];
			var count = results[2];
			var data = {
				sentences: sentences
			};
			if (categories) {
				data.categories = categories;
			}
			if (count) {
				data.count = count;
			}
			res.setHeader('Cache-Control', 'no-cache');
			res.json(data);
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.get('/api/sentences/:id', function(req, res) {
		Sentence.findOne({
			_id: req.params.id
		}, function(err, sentence) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				if (!sentence) {
					res.status(404).send(
						'cannot find sentence with id ' + req.params.id
					);
				} else {
					res.setHeader('Cache-Control', 'no-cache');
					res.json(sentence);
				}
			}
		});
	});

	app.post('/api/sentences/', function(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).send('Unauthorized');
		} else {
			var sentence = new Sentence(req.body);
			sentence.save(function(err) {
				if (err) {
					res.status(500).send(getBetterErrorMessage(err));
				} else {
					res.json(sentence);
				}
			});
		}
	});

	app.put('/api/sentences/:id', function(req, res) {
		if (!req.isAuthenticated()) {
			return res.status(401).send('Unauthorized');
		} else {
			Sentence.findOne({
				_id: req.params.id
			}, function(err, sentence) {
				if (err) {
					return res.status(500).send(err.message);
				}
				sentence = sentence || new Sentence();
				sentence.orcish = req.body.orcish;
				sentence.english = req.body.english;
				sentence.category = req.body.category;
				sentence.submittedBy = req.body.submittedBy;

				sentence.save(function(error) {
					if (error) {
						res.status(500).send(getBetterErrorMessage(error));
					} else {
						res.json(sentence);
					}
				});
			});
		}
	});

	app.delete('/api/sentences/:id', function(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).send('Unauthorized');
		} else {
			Sentence.findOneAndRemove({
				_id: req.params.id
			}, function(err, sentence) {
				if (err) {
					res.status(500).send(err.message);
				} else if (!sentence) {
					res.status(404).send(
						'sentence with id ' + req.params.id + ' does not exits'
					);
				} else {
					res.json(sentence);
				}
			});
		}
	});
}
