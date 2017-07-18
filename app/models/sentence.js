'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;
var parse = require('csv-parse');

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

SentenceSchema.statics.bulkAdd = function(data) {
	var Sentence = this;
	return new Promise(function(resolve, reject) {
		var parseOptions = {
			relax_column_count: true,
			skip_empty_lines: true
		};

		parse(data, parseOptions, function(error, records) {
			if (error) {
				reject(error);
			} else {
				resolve(records);
			}
		});
	})
	.then(function(records) {
		var sentences = records.map(function(record) {
			if (record.length < 3) {
				throw new Error('Record ' + record + ' has less than 3 values');
			}

			var sentence = {
				category: record[0],
				english: record[1],
				orcish: record[2]
			};
			if (record[3]) {
				sentence.submittedBy = record[3];
			}
			return sentence;
		});
		return Sentence.insertMany(sentences);
	});
};

module.exports = mongoose.model('Sentence', SentenceSchema);
