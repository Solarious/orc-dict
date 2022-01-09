'use strict';

var Word = require('./models/word');
var AsyncLock = require('async-lock');
var SearchIndex = require('./models/searchIndex');
var config = require('../config');
var lock = new AsyncLock();

module.exports = {
	get: get,
	setNeedsUpdate: setNeedsUpdate,
	getKeywords: getKeywords,
	setKeywordsNeedsUpdate: setKeywordsNeedsUpdate
};

var statsStore = {};
var keywordsStore = [{}, {}];
var needsUpdate = true;
var keywordsNeedUpdate = [true, true];
const MAX_LIMIT = 100;

function get() {
	return lock.acquire('stats', async function() {
		if (needsUpdate) {
			console.log('Rebuilding stats');
			statsStore = await build();
			if (needsUpdate)
				needsUpdate = false;
			console.log('Done rebuilding stats');
			return statsStore;
		} else {
			return statsStore;
		}
	});
}

function setNeedsUpdate() {
	needsUpdate = true;
}

function getKeywords(sortByWords, from, to) {
	return lock.acquire('keywords' + sortByWords, function() {
		if ((to > MAX_LIMIT) || (from < 0) || (to < 0) || (from > to)) {
			throw new Error('Invalid input range');
		}

		if (keywordsNeedUpdate[sortByWords]) {
			console.log('Rebuilding keyword stats (' + sortByWords + ')');
			return buildKeywords(sortByWords, MAX_LIMIT)
			.then(function(data) {
				if (keywordsNeedUpdate[sortByWords])
					keywordsNeedUpdate[sortByWords] = false;
				keywordsStore[sortByWords] = data;
				console.log('Done rebuilding keyword stats (' + sortByWords +
					')');
				return data.slice(from, to);
			});
		} else {
			return keywordsStore[sortByWords].slice(from, to);
		}
	});
}

function setKeywordsNeedsUpdate() {
	keywordsNeedUpdate[0] = true;
	keywordsNeedUpdate[1] = true;
}

function getEmptyStats() {
	return {
		adjective: {
			count: 0,
			types: {
				irregular: 0
			}
		},
		adverb: {
			count: 0
		},
		cardinal: {
			count: 0
		},
		conjunction: {
			count: 0
		},
		contraction: {
			count: 0
		},
		'copular verb': {
			count: 0
		},
		exclamation: {
			count: 0
		},
		interjection: {
			count: 0
		},
		noun: {
			count: 0,
			first: {
				count: 0,
				ad: 0,
				am: 0,
				ag: 0,
				aed: 0
			},
			secondMasculine: {
				count: 0,
				ul: 0,
				or: 0,
				k: 0,
				x: 0
			},
			secondNeutral: {
				count: 0,
				id: 0,
				ed: 0,
				d: 0,
				z: 0,
				dj: 0,
				on: 0
			},
			third: {
				count: 0,
				ash: 0,
				ard: 0,
				rd: 0
			},
			fourth: {
				count: 0,
				b: 0,
				f: 0,
				p: 0
			},
			fifth: {
				count: 0,
				ath: 0,
				at: 0
			},
			irregular: {
				count: 0
			}
		},
		prefix: {
			count: 0
		},
		preposition: {
			count: 0
		},
		pronoun: {
			count: 0,
			pronoun: {
				count: 0,
				singular: 0,
				plural: 0
			},
			possessive: {
				count: 0,
				singular: 0,
				plural: 0
			},
			demonstrative: {
				count: 0,
				singular: 0,
				plural: 0
			},
			relative: {
				count: 0,
				singular: 0,
				plural: 0
			}
		},
		suffix: {
			count: 0
		},
		verb: {
			count: 0,
			first: 0,
			second: 0,
		},
		total: 0
	};
}

async function build() {
	var skip = 0;
	var words;
	var stats = getEmptyStats();

	while (true) {
		words = await Word.find({})
			.sort({ id: 'asc' })
			.skip(skip)
			.limit(config.MAX_WORDS_LOAD)
			.lean()
			.exec();
		if (words.length == 0) break;
		skip += words.length;

		stats = words.reduce(reduceWord, stats);
	}

	return stats;
}

function reduceWord(stats, word) {
	stats.total += 1;
	if (!stats[word.PoS]) {
		throw new Error('Invalid PoS: ' + word.PoS);
	}
	stats[word.PoS].count += 1;
	if (word.PoS === 'noun') {
		var declStr = word.noun.declension;
		if (declStr === 'second') {
			let gender = word.noun.gender;
			declStr += gender.charAt(0).toUpperCase() + gender.slice(1);
		}

		stats[word.PoS][declStr].count += 1;

		if (declStr === 'first') {
			addNounEnding(stats, word, declStr, ['ad', 'am', 'ag', 'aed']);
		}
		if (declStr === 'secondMasculine') {
			addNounEnding(stats, word, declStr, ['ul', 'or', 'k', 'x']);
		}
		if (declStr === 'secondNeutral') {
			addNounEnding(
				stats, word, declStr, ['id', 'ed', 'd', 'z', 'dj', 'on']
			);
		}
		if (declStr === 'third') {
			addNounEnding(stats, word, declStr, ['ash', 'ard', 'rd']);
		}
		if (declStr === 'fourth') {
			addNounEnding(stats, word, declStr, ['b', 'f', 'p']);
		}
		if (declStr === 'fifth') {
			addNounEnding(stats, word, declStr, ['ath', 'at']);
		}
	}
	if (word.PoS === 'verb') {
		stats[word.PoS][word.verb.conjugation] += 1;
	}
	if (word.PoS === 'pronoun') {
		var type = word.pronoun.type;
		var number = word.pronoun.number;
		stats[word.PoS][type].count += 1;
		stats[word.PoS][type][number] += 1;
	}
	if (word.PoS === 'adjective') {
		var regexA = /^[^,]*([^,]{2}), -([^,]{2})/;
		var regexB = /^[^,]*([^,]{2}), [^,]*([^,]{2})/;
		var result;
		if ((result = regexA.exec(word.orcish)) !== null) {
			let adjType = '' + result[1] + ', -' + result[2];
			if (stats[word.PoS].types[adjType]) {
				stats[word.PoS].types[adjType] += 1;
			} else {
				stats[word.PoS].types[adjType] = 1;
			}
		} else if ((result = regexB.exec(word.orcish)) !== null) {
			let adjType = '' + result[1] + ', -' + result[2] + ' (custom)';
			if (stats[word.PoS].types[adjType]) {
				stats[word.PoS].types[adjType] += 1;
			} else {
				stats[word.PoS].types[adjType] = 1;
			}
		} else {
			stats[word.PoS].types.irregular += 1;
		}
	}

	return stats;
}

function addNounEnding(stats, word, declStr, endings) {
	for (let i = 0; i < endings.length; i++) {
		let ending = endings[i];
		if (word.orcish.endsWith(ending)) {
			stats[word.PoS][declStr][ending] += 1;
			return;
		}
	}
	throw new Error(
		'word ' + word.orcish + ' does not have any of the given endings'
	);
}

function buildKeywords(sortByWords, limit) {
	if (sortByWords) {
		return buildKeywordsSortWords(limit);
	} else {
		return buildKeywordsSortKeywords(limit);
	}
}

function buildKeywordsSortKeywords(limit) {
	return SearchIndex.aggregate()
	.group({
		_id: '$keyword',
		count: {
			$sum: 1
		},
		searchIndexes: {
			$push: {
				message: '$message',
				orcish: '$word.orcish',
				PoS: '$word.PoS',
				english: '$word.english',
				num: '$word.num'
			}
		}
	})
	.sort({
		count: -1
	})
	.limit(limit)
	.exec();
}

function buildKeywordsSortWords(limit) {
	return SearchIndex.aggregate()
	.allowDiskUse(true)
	.group({
		_id: '$keyword',
		words: {
			$addToSet: {
				orcish: '$word.orcish',
				num: '$word.num'
			}
		},
		searchIndexes: {
			$push: {
				message: '$message',
				orcish: '$word.orcish',
				PoS: '$word.PoS',
				english: '$word.english',
				num: '$word.num'
			}
		}
	})
	.project({
		searchIndexes: 1,
		count: {
			$size: '$words'
		}
	})
	.sort({
		count: -1
	})
	.limit(limit)
	.exec();
}
