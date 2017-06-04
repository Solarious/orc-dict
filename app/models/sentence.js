'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;

var SentenceSchema = new Schema({
	orcish: {
		type: String,
		required: true
	},
	english: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true,
		index: true
	},
	submittedBy: String
});

module.exports = mongoose.model('Sentence', SentenceSchema);
