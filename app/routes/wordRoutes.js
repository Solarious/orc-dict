'use strict';

var Word = require('../models/word');
var indexes = require('../indexes');
var stats = require('../stats');
var getBetterErrorMessage = require('../errorHelper').getBetterErrorMessage;

module.exports = addRoutesForWords;

function addRoutesForWords(app) {
	app.get('/api/words', function(req, res) {
		var resQuery = req.query || {};
		var sort = resQuery.sort;
		var skip = Number(resQuery.skip);
		var limit = Number(resQuery.limit);
		var getcount = resQuery.getcount;
		var pos = resQuery.pos;
		var declension = resQuery.declension;
		var gender;
		var conjugation = resQuery.conjugation;
		var pronounType = resQuery.pronountype;
		if (declension && declension.startsWith('second')) {
			gender = declension.endsWith('Masculine') ?
			'masculine' : 'neutral';
			declension = 'second';
		}

		var query = Word.find({}).select({
			orcish: 1,
			english: 1,
			PoS: 1,
			num: 1
		});
		var countQuery = Word.count();
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
			countQuery = countQuery.where('PoS', pos);
		}
		if (declension) {
			query = query.where('noun.declension', declension);
			countQuery = countQuery.where('noun.declension', declension);
		}
		if (gender) {
			query = query.where('noun.gender', gender);
			countQuery = countQuery.where('noun.gender', gender);
		}
		if (conjugation) {
			query = query.where('verb.conjugation', conjugation);
			countQuery = countQuery.where('verb.conjugation', conjugation);
		}
		if (pronounType) {
			query = query.where('pronoun.type', pronounType);
			countQuery = countQuery.where('pronoun.type', pronounType);
		}

		var promises = [query.lean().exec()];
		if (getcount) {
			promises.push(countQuery.exec());
		}
		Promise.all(promises)
		.then(function(values) {
			var data = {
				words: values[0]
			};
			if (values[1]) {
				data.count = values[1];
			}
			res.json(data);
		}, function(error) {
			res.status(500).send(error.message);
		});
	});

	app.post('/api/words', function(req, res) {
		var word = new Word();
		updateWordFromReq(word, req);
		word.save()
		.then(function() {
			res.json(word);
			indexes.forCreate(word)
			.catch(function(error) {
				console.log('error with indexes.forCreate:');
				console.log(error);
			});
			stats.setNeedsUpdate();
		})
		.catch(function(error) {
			res.status(500).send(getBetterErrorMessage(error));
		});
	});

	app.get('/api/words/:orcish/:num', function(req, res) {
		Word.findOne({
			orcish: req.params.orcish,
			num: req.params.num
		})
		.lean()
		.exec()
		.then(function(word) {
			if (!word) {
				res.status(404).send(
					'cannot find word: ' + req.params.orcish + ' ' +
					req.params.num
				);
			} else {
				res.json(word);
			}
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.put('/api/words/:orcish/:num', function(req, res) {
		Word.findOne({
			orcish: req.params.orcish,
			num: req.params.num
		})
		.exec()
		.then(function(word) {
			word = word || new Word();
			updateWordFromReq(word, req);
			if (req.params.orcish !== word.orcish) {
				word.num = undefined;
			}
			return word.save();
		})
		.then(function(word) {
			res.json(word);
			indexes.forUpdate(req.params.orcish, req.params.num, word)
			.catch(function(error) {
				console.log('error with indexes.forUpdate:');
				console.log(error);
			});
		})
		.catch(function(error) {
			console.log(error);
			res.status(400).send(getBetterErrorMessage(error));
		});
	});

	app.delete('/api/words/:orcish/:num', function(req, res) {
		Word.findOneAndRemove({
			'orcish': req.params.orcish,
			'num': req.params.num
		})
		.exec()
		.then(function(word) {
			if (!word) {
				var wordStr = req.params.orcish + ' ' + req.params.num;
				res.status(404).send('word ' + wordStr + ' does not exits');
			} else {
				res.json(word);
				indexes.forRemove(word)
				.catch(function(error) {
					console.log('error with indexes.forRemove:');
					console.log(error);
				});
				stats.setNeedsUpdate();
			}
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
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
			res.json(result);
			indexes.forRemoveByPoS(PoS)
			.catch(function(error) {
				console.log('error with indexes.forRemoveByPoS:');
				console.log(error);
			});
			stats.setNeedsUpdate();
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});
}

function updateWordFromReq(word, req) {
	word.orcish = req.body.orcish;
	word.english = req.body.english;
	word.PoS = req.body.PoS;
	add(word, req, 'extraInfo');
	add(word, req, 'coinedBy');
	add(word, req, 'namedAfter');
	addIfExists(word, req, 'relatedWords');
	addIfExists(word, req, 'adjective');
	addIfExists(word, req, 'noun');
	addIfExists(word, req, 'verb');
	addIfExists(word, req, 'pronoun');
	addIfExists(word, req, 'affix');
	addIfExists(word, req, 'copula');
}

function addIfExists(word, req, property) {
	if (req.body[property]) {
		word[property] = req.body[property];
	}
}

function add(word, req, property) {
	if (req.body[property]) {
		word[property] = req.body[property];
	} else {
		word[property] = undefined;
	}
}
