'use strict';

var stats = require('../stats');

module.exports = addRoutesForStats;

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
