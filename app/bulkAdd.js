'use strict';

var parse = require('csv-parse');
var Word = require('./models/word');
var autofill = require('./autofill');

module.exports = bulkAdd;

function print(str) {
	if (process.env.NODE_ENV !== 'test') {
		console.log(str);
	}
}

function bulkAdd(data, encoding, method, order) {
	return new Promise(function(resolve, reject) {
		print('Bulk Add: Started');
		if (encoding !== 'csv' && encoding !== 'tsv') {
			return reject(new Error('encoding has invalid value ' + encoding));
		}

		if (order !== 'e-o-p' && order !== 'o-p-e') {
			return reject(new Error('order has invalid value ' + order));
		}

		if (method !== 'remove' && method !== 'duplicate' &&
		method !== 'unique')	{
			return reject(new Error('method has invalid value ' + method));
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
		print('Bulk Add: parse done');
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
		print('Bulk Add: mapping done');
		if (method === 'remove') {
			var opts = records.map(function(record) {
				return {
					deleteMany: {
						filter: {
							orcish: record.orcish,
							PoS: record.PoS
						}
					}
				};
			});
			return Word.bulkWrite(opts)
			.then(function(data) {
				print('Bulk Add: remove done');
				return records;
			});
		}
		return records;
	})
	.then(function(records) {
		if (method === 'unique') {
			print('Bulk Add: getting words list for unique');
			return Word.find({})
			.select({
				orcish: 1,
				PoS: 1
			})
			.exec()
			.then(function(words) {
				return words.reduce(function(acc, word) {
					acc[word.orcish] = acc[word.orcish] || {};
					acc[word.orcish][word.PoS] = true;
					return acc;
				}, {});
			})
			.then(function(orcishValues) {
				print('Bulk Add: filtering out for unique');
				return records.filter(function(record) {
					var a = orcishValues[record.orcish];
					return !(a && a[record.PoS]);
				});
			});
		}
		return records;
	})
	.then(function(records) {
		print('Bulk Add: creating words');
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
		print('Bulk Add: inserting words');
		return Word.insertMany(words);
	});
}
