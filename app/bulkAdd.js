'use strict';

var parse = require('csv-parse');
var Word = require('./models/word');
var autofill = require('./autofill');

module.exports = bulkAdd;

function bulkAdd(data, encoding, method) {
	return new Promise(function(resolve, reject) {
		if (encoding !== 'csv' && encoding !== 'tsv') {
			return reject(new Error('encoding has invalid value ' + encoding));
		}

		var parseOptions = {};
		if (encoding === 'tsv') {
			parseOptions.delimiter = '\t';
		}

		parse(data, parseOptions, function(error, records) {
			if (error) {
				reject(error);
			} else {
				resolve(records);
			}
		});
	})
	.then(function(records) {
		if (method === 'remove') {
			var opts = records.map(function(record) {
				return {
					deleteOne: {
						filter: {
							orcish: record[1]
						}
					}
				};
			});
			return Word.bulkWrite(opts)
			.then(function(data) {
				return records;
			});
		}
		return records;
	})
	.then(function(records) {
		if (method === 'unique') {
			return Word.find({}).exec()
			.then(function(words) {
				var listOfOrcish = {};
				for (let i = 0; i < words.length; i++) {
					listOfOrcish[words[i].orcish] = true;
				}
				return listOfOrcish;
			})
			.then(function(orcish) {
				return records.filter(function(record) {
					return !(record[1] in orcish);
				});
			});
		}
		return records;
	})
	.then(function(records) {
		return records.map(function(record) {
			if (record.length < 3) {
				throw ('Record ' + record + ' has less than 3 values');
			}
			var word = {
				english: record[0],
				orcish: record[1],
				PoS: record[2]
			};
			var hasPart = ['adjective', 'noun', 'verb'];
			if (hasPart.indexOf(word.PoS) !== -1) {
				autofill(word.orcish, word.PoS, function(error, data) {
					if (error) {
						throw error;
					}
					word[word.PoS] = data;
				});
			}

			var hasOtherPart = [
				'pronoun',
				'possessive',
				'demonstrative',
				'relative'
			];
			if (hasOtherPart.indexOf(word.PoS) !== -1) {
				throw new Error(
					'Cannot use bulkadd with words with PoS ' + word.PoS
				);
			}

			return word;
		});
	})
	.then(function(words) {
		return Word.insertMany(words);
	});
}
