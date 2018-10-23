'use strict';

var Clan = require('../models/clan');
var getBetterErrorMessage = require('../errorHelper').getBetterErrorMessage;

module.exports = addRoutesForClans;

function addRoutesForClans(app) {
	app.get('/api/clans', function(req, res) {
		req.query = req.query || {};
		var skip = Number(req.query.skip);
		var limit = Number(req.query.limit);
		var getCount = req.query.getcount;

		var query = Clan.find({}).select({
			name: 1,
			orderingName: 1,
			orcishName: 1,
			foundedBy: 1,
			shortDesc: 1
		})
		.sort('orderingName');

		if (skip) {
			query = query.skip(skip);
		}
		if (limit) {
			query = query.limit(limit);
		}

		var promises = [query.lean().exec()];
		if (getCount) {
			promises.push(Clan.countDocuments());
		}
		Promise.all(promises)
		.then(function(values) {
			var data = {
				clans: values[0]
			};
			if (values[1] != undefined) {
				data.count = values[1];
			}
			res.json(data);
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.post('/api/clans', function(req, res) {
		var clan = new Clan(req.body);
		clan.save()
		.then(function(data) {
			res.json(clan);
		})
		.catch(function(error) {
			res.status(500).send(getBetterErrorMessage(error));
		});
	});

	app.get('/api/clans/:name', function(req, res) {
		Clan.findOne({
			name: req.params.name
		})
		.lean()
		.exec()
		.then(function(clan) {
			if (!clan) {
				res.status(404).send('cannot find clan: ' + req.params.name);
			} else {
				res.json(clan);
			}
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.put('/api/clans/:name', function(req, res) {
		Clan.findOne({
			name: req.params.name
		})
		.exec()
		.then(function(clan) {
			clan = clan || new Clan();
			clan.name = req.body.name;
			clan.orcishName = req.body.orcishName;
			clan.foundedBy = req.body.foundedBy ? req.body.foundedBy : undefined;
			clan.shortDesc = req.body.shortDesc;
			clan.history = req.body.history;
			clan.customs = req.body.customs;
			clan.relations = req.body.relations;

			return clan.save();
		})
		.then(function(clan) {
			res.json(clan);
		})
		.catch(function(error) {
			res.status(400).send(getBetterErrorMessage(error));
		});
	});

	app.delete('/api/clans/:name', function(req, res) {
		Clan.findOneAndRemove({
			name: req.params.name
		})
		.exec()
		.then(function(clan) {
			if (!clan) {
				res.status(404).send(
					'clan with name ' + req.params.name + ' does not exist'
				);
			} else {
				res.json(clan);
			}
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.post('/api/bulkaddclans', function(req, res) {
		Clan.bulkAdd(req.body.data)
		.then(function(clans) {
			res.json({clans: clans});
		})
		.catch(function(error) {
			res.status(400).send(error.message);
		});
	});

	app.delete('/api/allclans', function(req, res) {
		Clan.deleteMany({})
		.then(function(result) {
			res.json(result);
		})
		.catch(function(error) {
			res.status(500).send(error.message);
		});
	});

	app.delete('/api/allclans', (req, res) => {
		Clan.deleteMany({})
		.then(result => res.json(result))
		.catch(error => res.status(500).send(error.message));
	});
}
