'use strict';

var autofillAsync = require('../autofill').autofillAsync;

module.exports = addRoutesForAutofill;

function addRoutesForAutofill(app) {
	app.get('/api/autofillword/:PoS/:orcish', function(req, res) {
		var PoS = req.params.PoS;
		var orcish = req.params.orcish;
		autofillAsync(orcish, PoS)
		.then(function(wordPart) {
			res.json(wordPart);
		})
		.catch(function(error) {
			res.status(404).send(error.message);
		});
	});
}
