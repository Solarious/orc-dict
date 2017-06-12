'use strict';

var path = require('path');
var wordRoutes = require('./wordRoutes.js');
var userRoutes = require('./userRoutes.js');
var searchRoutes = require('./searchRoutes.js');
var autofillRoutes = require('./autofillRoutes.js');
var bulkAddRoutes = require('./bulkAddRoutes.js');
var statsRoutes = require('./statsRoutes.js');
var sentenceRoutes = require('./sentenceRoutes.js');

module.exports = addRoutes;

function addRoutes(app) {
	wordRoutes(app);
	userRoutes(app);
	searchRoutes(app);
	autofillRoutes(app);
	bulkAddRoutes(app);
	statsRoutes(app);
	sentenceRoutes(app);

	app.get('(?!/api/)*', function(req, res) {
		res.sendFile(path.resolve(__dirname, '../../public/index.html'));
	});
}
