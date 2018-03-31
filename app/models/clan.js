'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;

var ClanSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: true
	},
	orcishName: {
		type: String,
		required: true
	},
	foundedBy: String,
	shortDesc: {
		type: String,
		required: true
	},
	history: [String],
	customs: [String],
	relations: [String]
});

ClanSchema.statics.bulkAdd = function(data) {
	var Clan = this;
	data = JSON.parse(data);
	if (!Array.isArray(data)) {
		data = [data];
	}
	return Clan.insertMany(data);
};

module.exports = mongoose.model('Clan', ClanSchema);
