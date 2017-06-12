'use strict';

var bulkAdd = require('../bulkAdd');
var stats = require('../stats');
var getBetterErrorMessage = require('../errorHelper').getBetterErrorMessage;

module.exports = addRoutesForBulkAdd;

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
				stats.setNeedsUpdate();
			})
			.catch(function(error) {
				res.status(404).send(getBetterErrorMessage(error));
			});
		}
	});
}
