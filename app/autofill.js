var Word = require('./models/word');

module.exports = function(orcish, english, PoS, callback) {
	var word = new Word();
	word.orcish = orcish;
	word.english = english;
	word.PoS = PoS;
	if (PoS === 'verb') {
		if (orcish.endsWith('a')) {
			firstConjVerb(word);
			callback(null, word);
		} else if (orcish.endsWith('ai')) {
			secondConjVerb(word);
			callback(null, word);
		} else {
			return callback('Word ' + orcish + ' has no valid conjugation');
		}
	} else {
		return callback('Invalid PoS: ' + PoS);
	}
};// module.exports

function firstConjVerb(word) {
	var orcish = word.orcish;
	word.verb = {
		conjugation: 'first',
		infinitive: orcish,
		active: {
			present: {
				first: {
					singular: orcish + 'g',
					plural: orcish + 'gax'
				},
				second: {
					singular: orcish + 's',
					plural: orcish + 'gas'
				},
				third: {
					singular: orcish + 'k',
					plural: orcish + 'gek'
				}
			},
			past: {
				first: {
					singular: 'ash' + orcish + 'g',
					plural: 'ash' + orcish + 'gax'
				},
				second: {
					singular: 'ash' + orcish + 's',
					plural: 'ash' + orcish + 'gas'
				},
				third: {
					singular: 'ash' + orcish + 'k',
					plural: 'ash' + orcish + 'gek'
				}
			},
			future: {
				first: {
					singular: 'ar' + orcish + 'g',
					plural: 'ar' + orcish + 'gax'
				},
				second: {
					singular: 'ar' + orcish + 's',
					plural: 'ar' + orcish + 'gas'
				},
				third: {
					singular: 'ar' + orcish + 'k',
					plural: 'ar' + orcish + 'gek'
				}
			},
			pastPerfect: {
				first: {
					singular: 'hush' + orcish + 'g',
					plural: 'hush' + orcish + 'gax'
				},
				second: {
					singular: 'hush' + orcish + 's',
					plural: 'hush' + orcish + 'gas'
				},
				third: {
					singular: 'hush' + orcish + 'k',
					plural: 'hush' + orcish + 'gek'
				}
			},
			futurePerfect: {
				first: {
					singular: 'hur' + orcish + 'g',
					plural: 'hur' + orcish + 'gax'
				},
				second: {
					singular: 'hur' + orcish + 's',
					plural: 'hur' + orcish + 'gas'
				},
				third: {
					singular: 'hur' + orcish + 'k',
					plural: 'hur' + orcish + 'gek'
				}
			},
		},
		passive: {
			present: {
				first: {
					singular: orcish + 'reg',
					plural: orcish + 'regax'
				},
				second: {
					singular: orcish + 'ras',
					plural: orcish + 'regas'
				},
				third: {
					singular: orcish + 'ruk',
					plural: orcish + 'regek'
				}
			},
			past: {
				first: {
					singular: 'ash' + orcish + 'reg',
					plural: 'ash' + orcish + 'regax'
				},
				second: {
					singular: 'ash' + orcish + 'ras',
					plural: 'ash' + orcish + 'regas'
				},
				third: {
					singular: 'ash' + orcish + 'ruk',
					plural: 'ash' + orcish + 'regek'
				}
			},
			future: {
				first: {
					singular: 'ar' + orcish + 'reg',
					plural: 'ar' + orcish + 'regax'
				},
				second: {
					singular: 'ar' + orcish + 'ras',
					plural: 'ar' + orcish + 'regas'
				},
				third: {
					singular: 'ar' + orcish + 'ruk',
					plural: 'ar' + orcish + 'regek'
				}
			},
			pastPerfect: {
				first: {
					singular: 'hush' + orcish + 'reg',
					plural: 'hush' + orcish + 'regax'
				},
				second: {
					singular: 'hush' + orcish + 'ras',
					plural: 'hush' + orcish + 'regas'
				},
				third: {
					singular: 'hush' + orcish + 'ruk',
					plural: 'hush' + orcish + 'regek'
				}
			},
			futurePerfect: {
				first: {
					singular: 'hur' + orcish + 'reg',
					plural: 'hur' + orcish + 'regax'
				},
				second: {
					singular: 'hur' + orcish + 'ras',
					plural: 'hur' + orcish + 'regas'
				},
				third: {
					singular: 'hur' + orcish + 'ruk',
					plural: 'hur' + orcish + 'regek'
				}
			},
		},
		imperative: {
			singular: orcish + 'rt',
			plural: orcish + 'rit'
		},
		gerund: orcish.slice(0, -1) + 'on',
		participle: {
			feminine: orcish.slice(0, -1) + 'onad',
			masculine: orcish.slice(0, -1) + 'onul'
		},
		agent: {
			feminine: orcish + 'g',
			masculine: orcish + 'k',
			dishonorable: orcish + 'dj'
		}
	};
}
