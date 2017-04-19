var parse = require('csv-parse');
var Word = require('./models/word');
var autofill = require('./autofill');

module.exports = function(data, encoding, remove, callback) {
	if (encoding !== 'csv' && encoding !== 'tsv') {
		return callback(new Error('encoding has invalid value ' + encoding));
	}

	var parseOptions = {};
	if (encoding === 'tsv') {
		parseOptions.delimiter = '\t';
	}

	parse(data, parseOptions, function(err, output) {
		if (err) {
			return callback(new Error(
				'Error parsing data: ' + err.message
			));
		}
		var words = [];
		var opts = [];
		for (var i = 0; i < output.length; i++) {
			var record = output[i];
			if (record.length < 3) {
				return callback(new Error(
					'Record ' + record + ' has less than 3 values'
				));
			}
			var word = {
				english: record[0],
				orcish: record[1],
				PoS: record[2]
			};

			var hasPart = ['adjective', 'noun', 'verb'];
			if (hasPart.indexOf(word.PoS) !== -1) {
				var error;
				var data;
				autofill(word.orcish, word.PoS, function(err, theData) {
					error = err;
					data = theData;
				});
				if (error) {
					return callback(new Error(
						'Error with ' + record + ': ' + error.message
					));
				}
				word[word.PoS] = data;
			}

			words.push(word);
			opts.push({
				deleteOne: {
					filter: {
						orcish: word.orcish
					}
				}
			});
		}
		if (remove) {
			Word.bulkWrite(opts, function(error, results) {
				if (err) {
					callback(err);
				} else {
					Word.insertMany(words, callback);
				}
			});
		} else {
			Word.insertMany(words, callback);
		}
	});
};
