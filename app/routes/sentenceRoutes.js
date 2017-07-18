'use strict';

var Sentence = require('../models/sentence');
var getBetterErrorMessage = require('../errorHelper').getBetterErrorMessage;

module.exports = addRoutesForSentences;

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
		var sentence = new Sentence(req.body);
		sentence.save(function(err) {
			if (err) {
				res.status(500).send(getBetterErrorMessage(err));
			} else {
				res.json(sentence);
			}
		});
	});

	app.put('/api/sentences/:id', function(req, res) {
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
	});

	app.delete('/api/sentences/:id', function(req, res) {
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
	});

	app.post('/api/bulkaddsentences/', function(req, res) {
		Sentence.bulkAdd(req.body.data)
		.then(function(sentences) {
			res.json({ sentences: sentences });
		})
		.catch(function(error) {
			res.status(400).send(error.message);
		});
	});

	app.delete('/api/allsentences/', function(req, res) {
		Sentence.remove({})
		.then(function(result) {
			res.json(result);
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});
}
