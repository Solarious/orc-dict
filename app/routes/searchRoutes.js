'use strict';

var search = require('../search');
var indexes = require('../indexes');

module.exports = addRoutesForSearch;

function addRoutesForSearch(app) {
	app.get('/api/search', function(req, res) {
		var query = req.query || {};
		var q = query.q;
		if (!q) {
			return res.status(400).send('missing query paramerter q');
		}

		Promise.all([
			search.getMatches(q),
			search.getTextMatches(q)
		])
		.then(function(data) {
			res.json({
				results: data[0],
				textResults: data[1]
			});
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.post('/api/search/rebuild', function(req, res) {
		indexes.rebuild()
		.catch(function(error) {
			console.log('error with indexes.rebuild');
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
