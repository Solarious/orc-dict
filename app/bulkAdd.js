'use strict';

var parse = require('csv-parse');
var Word = require('./models/word');
var autofill = require('./autofill');

module.exports = bulkAdd;

function bulkAdd(data, encoding, method, order) {
	return new Promise(function(resolve, reject) {
		console.log('Bulk Add: Started');
		if (encoding !== 'csv' && encoding !== 'tsv') {
			return reject(new Error('encoding has invalid value ' + encoding));
		}

		if (order !== 'e-o-p' && order !== 'o-p-e') {
			return reject(new Error('order has invalid value ' + order));
		}

		var parseOptions = {
			relax_column_count: true
		};
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
		console.log('Bulk Add: parse done');
		return records.map(function(record) {
			if (order === 'e-o-p') {
				return {
					english: record[0],
					orcish: record[1],
					PoS: record[2]
				};
			}
			if (order === 'o-p-e') {
				return {
					english: record[2],
					orcish: record[0],
					PoS: record[1]
				};
			}
		});
	})
	.then(function(records) {
		console.log('Bulk Add: mapping done');
		if (method === 'remove') {
			var opts = records.map(function(record) {
				return {
					deleteOne: {
						filter: {
							orcish: record.orcish
						}
					}
				};
			});
			return Word.bulkWrite(opts)
			.then(function(data) {
				console.log('Bulk Add: remove done');
				return records;
			});
		}
		return records;
	})
	.then(function(records) {
		if (method === 'unique') {
			console.log('Bulk Add: getting words list for unique');
			return Word.find({}).exec()
			.then(function(words) {
				var listOfOrcish = {};
				for (let i = 0; i < words.length; i++) {
					listOfOrcish[words[i].orcish] = true;
				}
				return listOfOrcish;
			})
			.then(function(orcish) {
				console.log('Bulk Add: filtering out for unique');
				return records.filter(function(record) {
					return !(record.orcish in orcish);
				});
			});
		}
		return records;
	})
	.then(function(records) {
		console.log('Bulk Add: creating words');
		return records.map(function(record) {
			if (record.length < 3) {
				throw ('Record ' + record + ' has less than 3 values');
			}
			var word = record;
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
		console.log('Bulk Add: inserting words');
		return Word.insertMany(words);
	});
}
