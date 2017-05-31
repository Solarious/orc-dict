'use strict';

var Word = require('./models/word');

module.exports = {
	get: get
};

function get() {
	return Word.find({})
	.exec()
	.then(function(words) {
		return words.reduce(reduceWord, {
			adjective: {
				count: 0
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
			demonstrative: {
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
					ag: 0
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
					dj: 0
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
			possessive: {
				count: 0
			},
			prefix: {
				count: 0
			},
			preposition: {
				count: 0
			},
			pronoun: {
				count: 0
			},
			relative: {
				count: 0
			},
			suffix: {
				count: 0
			},
			verb: {
				count: 0,
				first: 0,
				second: 0,
				irregular: 0
			},
			total: 0
		});
	});
}

function reduceWord(stats, word) {
	stats.total += 1;
	stats[word.PoS].count += 1;
	if (word.PoS === 'noun') {
		var declStr = word.noun.declension;
		if (declStr === 'second') {
			let gender = word.noun.gender;
			declStr += gender.charAt(0).toUpperCase() + gender.slice(1);
		}
		stats[word.PoS][declStr].count += 1;
		if (declStr === 'first') {
			addNounEnding(stats, word, declStr, ['ad', 'am', 'ag']);
		}
		if (declStr === 'secondMasculine') {
			addNounEnding(stats, word, declStr, ['ul', 'or', 'k', 'x']);
		}
		if (declStr === 'secondNeutral') {
			addNounEnding(stats, word, declStr, ['id', 'ed', 'd', 'z', 'dj']);
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

	return stats;
}

function addNounEnding(stats, word, declStr, endings) {
	var found = false;
	endings.forEach(function(ending) {
		if (word.orcish.endsWith(ending)) {
			stats[word.PoS][declStr][ending] += 1;
			found = true;
		}
	});
	if (!found) {
		throw new Error(
			'word ' + word.orcish + ' does not have any of the given endings'
		);
	}
}
