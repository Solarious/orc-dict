'use strict';

var stats = require('../stats');

module.exports = addRoutesForStats;

function addRoutesForStats(app) {
	app.get('/api/stats', function(req, res) {
		stats.get()
		.then(function(stats) {
			res.json(stats);
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.get('/api/stats/keywords/:sortByWords/:limit', function(req, res) {
		var sortByWords = Number(req.params.sortByWords);
		var limit = Number(req.params.limit);
		stats.getKeywords(sortByWords, limit)
		.then(function(data) {
			res.json({
				data: data
			});
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.post('/api/stats/set-needs-update', function(req, res) {
		stats.setNeedsUpdate();
		res.send('Stats will now update when next viewed');
	});
}
