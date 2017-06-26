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
			relax_column_count: true,
			skip_empty_lines: true
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
			if (record.length < 3) {
				throw new Error('Record ' + record + ' has less than 3 values');
			}
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
			var word = record;
			var hasPart = ['adjective', 'noun', 'verb'];
			if (hasPart.indexOf(word.PoS) !== -1) {
				word[word.PoS] = autofill(word.orcish, word.PoS);
			}

			if (word.PoS === 'copular verb') {
				throw new Error('Cannot use bulkadd with copular verbs');
			}

			return word;
		});
	})
	.then(function(words) {
		return Promise.all(words.map(function(word) {
			var wordModel = new Word(word);
			return wordModel.validate();
		}))
		.then(function() {
			print('Bulk Add: validation done');
			return words;
		});
	})
	.then(function(words) {
		if (method === 'remove') {
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
		}
		return words;
	})
	.then(function(words) {
		print('Bulk Add: inserting words');
		return Word.insertManyWithRetry(words);
	})
	.then(function(result) {
		if (method === 'unique' || method === 'duplicate') {
			indexes.forInsertMany(result.successes);
		}
		if (method === 'remove') {
			indexes.forReplaceMany(result.successes);
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
			if (operation === 'p.i.') {
				addPronounInfo(word, value);
			}
		} else {
			return word;
		}
	}
}

function addPronounInfo(word, info) {
	var values = info.split(' ');
	if (values.length !== 7) {
		throw new Error('Word ' + word.orcish + ' p.i. must have 7 values');
	}
	word.pronoun = {
		type: values[0],
		number: values[1],
		nominative: values[2],
		genitive: values[3],
		dative: values[4],
		accusative: values[5],
		vocative: values[6],
	};
}
