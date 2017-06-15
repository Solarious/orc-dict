'use strict';

var parse = require('csv-parse');
var Word = require('./models/word');
var autofill = require('./autofill').autofill;
var indexes = require('./indexes');

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
		var words = records.map(function(record) {
			var word;
			if (order === 'e-o-p') {
				word = {
					english: record[0],
					orcish: record[1],
					PoS: record[2]
				};
			}
			if (order === 'o-p-e') {
				word = {
					english: record[2],
					orcish: record[0],
					PoS: record[1]
				};
			}
			handleExtras(word, record.slice(3));
			return word;
		});
		return words;
	})
	.then(function(records) {
		print('Bulk Add: mapping done');
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
				word[word.PoS] = autofill(word.orcish, word.PoS);
			}

			if (word.PoS === 'pronoun') {
				throw new Error('Cannot use bulkadd with pronouns');
			}
			if (word.PoS === 'copular verb') {
				throw new Error('Cannot use bulkadd with copular verbs');
			}

			return word;
		});
	})
	.then(function(words) {
		if (method === 'remove') {
			var promises = words.map(function(word) {
				var wordModel = new Word(word);
				return wordModel.validate();
			});
			return Promise.all(promises)
			.then(function() {
				var opts = words.map(function(word) {
					return {
						deleteMany: {
							filter: {
								orcish: word.orcish,
								PoS: word.PoS
							}
						}
					};
				});
				return Word.bulkWrite(opts)
				.then(function(data) {
					print('Bulk Add: remove done');
					return words;
				});
			});
		}
		return words;
	})
	.then(function(words) {
		print('Bulk Add: inserting words');
		return Word.insertMany(words);
	})
	.then(function(result) {
		if (method === 'unique' || method === 'duplicate') {
			indexes.forInsertMany(result);
		}
		if (method === 'remove') {
			indexes.forReplaceMany(result);
		}
		return result;
	});
}

function handleExtras(word, extra) {
	while (true) {
		let operation = extra.shift();
		let value = extra.shift();
		if (operation && value) {
			if (operation === 'd.f.') {
				if (word.extraInfo) {
					word.extraInfo += '\n';
				} else {
					word.extraInfo = '';
				}
				word.extraInfo += 'Defined for: ' + value;
			}
			if (operation === 'c.b.') {
				word.coinedBy = value;
			}
			if (operation === 'n.a.') {
				word.namedAfter = value;
			}
			if (operation === 'n.a.c.b.') {
				word.coinedBy = value;
				word.namedAfter = value;
			}
			if (operation === 'e.i.') {
				if (word.extraInfo) {
					word.extraInfo = value + '\n' + word.extraInfo;
				} else {
					word.extraInfo = value;
				}
			}
			if (operation === 'a.e.k.') {
				word.keywords = word.keywords || [];
				word.keywords.push({
					keyword: value,
					priority: 1,
					message: 'english'
				});
			}
		} else {
			return word;
		}
	}
}
