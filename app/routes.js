'use strict';

var path = require('path');
var passport = require('passport');
var Word = require('./models/word');
var autofill = require('./autofill');
var bulkAdd = require('./bulkAdd');
var search = require('./search');

function updateWordFromReq(word, req) {
	word.orcish = req.body.orcish;
	word.english = req.body.english;
	word.PoS = req.body.PoS;
	addIfExists(word, req, 'extraInfo');
	addIfExists(word, req, 'coinedBy');
	addIfExists(word, req, 'namedAfter');
	addIfExists(word, req, 'relatedWords');
	addIfExists(word, req, 'exampleSentences');
	addIfExists(word, req, 'keywords');
	addIfExists(word, req, 'adjective');
	addIfExists(word, req, 'noun');
	addIfExists(word, req, 'verb');
	addIfExists(word, req, 'pronoun');
	addIfExists(word, req, 'possessive');
	addIfExists(word, req, 'demonstrative');
	addIfExists(word, req, 'relative');
	addIfExists(word, req, 'affix');
}

function addIfExists(word, req, property) {
	if (req.body[property]) {
		word[property] = req.body[property];
	}
}

function rebuild() {
	var start = process.hrtime();
	search.rebuild(function(error, data) {
		if (error) {
			console.log('Error with search.rebuild:');
			console.log(error.message);
		}
		var total = process.hrtime(start);
		var ms = total[1] / 1000000;
		console.log('Search.rebuild took ' + ms + ' ms');
	});
}

module.exports = function(app) {

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
		PoS: 1
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
				res.status(500).send(err.message);
			} else {
				res.json(newWord);
				rebuild();
			}
		});
	}
});

app.get('/api/words/:word_orcish', function(req, res) {
	Word.findOne({
		'orcish': req.params.word_orcish
	}, function(err, word) {
		if (err) {
			res.status(500).send(err.message);
		} else {
			if (!word) {
				res.status(404).send(
					'cannot find word: ' + req.params.word_orcish
				);
			} else {
				res.setHeader('Cache-Control', 'no-cache');
				res.json(word);
			}
		}
	});
});

app.put('/api/words/:word_orcish', function(req, res) {
	if (!req.isAuthenticated()) {
		res.status(401).send({ error: 'Unauthorized' });
	} else {
		Word.findOne({
			'orcish': req.params.word_orcish
		}, function(err, word) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				word = word || new Word();
				updateWordFromReq(word, req);
				word.save(function(err) {
					if (err) {
						res.status(500).send(err.message);
					} else {
						res.json(word);
						rebuild();
					}
				});
			}
		});
	}
});

app.delete('/api/words/:word_orcish', function(req, res) {
	if (!req.isAuthenticated()) {
		res.status(401).send({ error: 'Unauthorized' });
	} else {
		Word.findOneAndRemove({
			'orcish': req.params.word_orcish
		}, function (err, word) {
			if (err) {
				res.status(500).send(err.message);
			} else if (!word) {
				res.status(404).send(
					'word ' + req.params.word_orcish + ' does not exist'
				);
			} else {
				res.json(word);
				rebuild();
			}
		});
	}
});

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

app.post('/api/user/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(500).json({
					err: err
				});
			}
			res.status(200).json({
				status: 'Login successful'
			});
		});
	})(req, res, next);
});

app.get('/api/user/logout', function(req, res) {
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

app.post('/api/csrftest', function(req, res) {
	res.json({ message: 'CSRF test success' });
});

app.post('/api/bulkadd', function(req, res) {
	if (!req.isAuthenticated()) {
		res.status(401).send('Unauthorized');
	} else {
		var data = req.body.data;
		var encoding = req.body.encoding;
		var remove = (req.body.remove === 'true');
		bulkAdd(data, encoding, remove, function(err, results) {
			if (err) {
				res.status(404).send(err.message);
			} else {
				res.json(results);
				rebuild();
			}
		});
	}
});

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

app.get('/api/list-search-indexes', function(req, res) {
	search.getAll(function(error, data) {
		if (error) {
			res.status(500).send(error.message);
		} else {
			res.send(data);
		}
	});
});

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

};// module.exports
