var Word = require('./models/word');

module.exports = function(orcish, PoS, callback) {
	if (PoS === 'verb') {
		if (orcish.endsWith('a')) {
			return callback(null, firstConjVerb(orcish));
		} else if (orcish.endsWith('ai')) {
			return callback(null, secondConjVerb(orcish));
		} else {
			return callback(
				new Error('Word ' + orcish + ' has no valid conjugation')
			);
		}
	} else if (PoS === 'noun') {
		var endings;

		endings = ['ad', 'am', 'ag', 'aed'];
		for (var i = 0; i < endings.length; i++) {
			var ending = endings[i];
			if (orcish.endsWith(ending)) {
				return callback(null, firstDeclNoun(orcish, ending));
			}
		}

		endings = ['ul', 'or', 'k', 'x'];
		for (var i = 0; i < endings.length; i++) {
			var ending = endings[i];
			if (orcish.endsWith(ending)) {
				return callback(
					null, secondDeclNoun(orcish, ending, 'masculine')
				);
			}
		}

		endings = ['id', 'ed', 'd', 'z', 'dj'];
		for (var i = 0; i < endings.length; i++) {
			var ending = endings[i];
			if (orcish.endsWith(ending)) {
				return callback(
					null, secondDeclNoun(orcish, ending, 'neutral')
				);
			}
		}

		endings = ['ash', 'ard', 'rd'];
		for (var i = 0; i < endings.length; i++) {
			var ending = endings[i];
			if (orcish.endsWith(ending)) {
				return callback(null, thirdDeclNoun(orcish, ending));
			}
		}

		endings = ['b', 'f', 'p'];
		for (var i = 0; i < endings.length; i++) {
			var ending = endings[i];
			if (orcish.endsWith(ending)) {
				return callback(null, fourthDeclNoun(orcish, ending));
			}
		}

		endings = ['ath', 'at'];
		for (var i = 0; i < endings.length; i++) {
			var ending = endings[i];
			if (orcish.endsWith(ending)) {
				return callback(null, fifthDeclNoun(orcish, ending));
			}
		}

		return callback(new Error(orcish + ' has no valid declension'));
	} else {
		return callback(new Error('Invalid PoS: ' + PoS));
	}
};// module.exports

function firstConjVerb(orcish) {
	return {
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

function secondConjVerb(orcish) {
	var base = orcish.slice(0, -2);
	return {
		conjugation: 'second',
		infinitive: orcish,
		active: {
			present: {
				first: {
					singular: base + 'ai',
					plural: base + 'alax'
				},
				second: {
					singular: base + 'ash',
					plural: base + 'ahas'
				},
				third: {
					singular: base + 'ak',
					plural: base + 'ahek'
				}
			},
			past: {
				first: {
					singular: 'zsa' + base + 'ai',
					plural: 'zsa' + base + 'alax'
				},
				second: {
					singular: 'zsa' + base + 'ash',
					plural: 'zsa' + base + 'ahas'
				},
				third: {
					singular: 'zsa' + base + 'ak',
					plural: 'zsa' + base + 'ahek'
				}
			},
			future: {
				first: {
					singular: 'zsur' + base + 'ai',
					plural: 'zsur' + base + 'alax'
				},
				second: {
					singular: 'zsur' + base + 'ash',
					plural: 'zsur' + base + 'ahas'
				},
				third: {
					singular: 'zsur' + base + 'ak',
					plural: 'zsur' + base + 'ahek'
				}
			},
			pastPerfect: {
				first: {
					singular: 'huzs' + base + 'ai',
					plural: 'huzs' + base + 'alax'
				},
				second: {
					singular: 'huzs' + base + 'ash',
					plural: 'huzs' + base + 'ahas'
				},
				third: {
					singular: 'huzs' + base + 'ak',
					plural: 'huzs' + base + 'ahek'
				}
			},
			futurePerfect: {
				first: {
					singular: 'azsur' + base + 'ai',
					plural: 'azsur' + base + 'alax'
				},
				second: {
					singular: 'azsur' + base + 'ash',
					plural: 'azsur' + base + 'ahas'
				},
				third: {
					singular: 'azsur' + base + 'ak',
					plural: 'azsur' + base + 'ahek'
				}
			},
		},
		passive: {
			present: {
				first: {
					singular: base + 'aeg',
					plural: base + 'belas'
				},
				second: {
					singular: base + 'esh',
					plural: base + 'behas'
				},
				third: {
					singular: base + 'aek',
					plural: base + 'barrak'
				}
			},
			past: {
				first: {
					singular: 'zsa' + base + 'aeg',
					plural: 'zsa' + base + 'belas'
				},
				second: {
					singular: 'zsa' + base + 'esh',
					plural: 'zsa' + base + 'behas'
				},
				third: {
					singular: 'zsa' + base + 'aek',
					plural: 'zsa' + base + 'barrak'
				}
			},
			future: {
				first: {
					singular: 'zsur' + base + 'aeg',
					plural: 'zsur' + base + 'belas'
				},
				second: {
					singular: 'zsur' + base + 'esh',
					plural: 'zsur' + base + 'behas'
				},
				third: {
					singular: 'zsur' + base + 'aek',
					plural: 'zsur' + base + 'barrak'
				}
			},
			pastPerfect: {
				first: {
					singular: 'huzs' + base + 'aeg',
					plural: 'huzs' + base + 'belas'
				},
				second: {
					singular: 'huzs' + base + 'esh',
					plural: 'huzs' + base + 'behas'
				},
				third: {
					singular: 'huzs' + base + 'aek',
					plural: 'huzs' + base + 'barrak'
				}
			},
			futurePerfect: {
				first: {
					singular: 'azsur' + base + 'aeg',
					plural: 'azsur' + base + 'belas'
				},
				second: {
					singular: 'azsur' + base + 'esh',
					plural: 'azsur' + base + 'behas'
				},
				third: {
					singular: 'azsur' + base + 'aek',
					plural: 'azsur' + base + 'barrak'
				}
			},
		},
		imperative: {
			singular: base + 'ort',
			plural: base + 'orot'
		},
		gerund: orcish + 'on',
		participle: {
			feminine: orcish + 'onad',
			masculine: orcish + 'onul'
		},
		agent: {
			feminine: base + 'ag',
			masculine: base + 'ak'
		}
	};
}

function firstDeclNoun(orcish, ending) {
	var base = orcish.slice(0, -(ending.length));
	if (ending === 'am') {
		var accusativeEnding = 'adz';
	} else {
		var accusativeEnding = 'az';
	}
	return {
		declension: 'first',
		gender: 'feminine',
		nominative: {
			singular: orcish,
			plural: base + 'adz'
		},
		genitive: {
			singular: base + 'ar',
			plural: base + 'arru'
		},
		dative: {
			singular: base + 'ae',
			plural: base + 'aes'
		},
		accusative: {
			singular: base + accusativeEnding,
			plural: base + 'aruz'
		},
		vocative: {
			singular: base + 'ae',
			plural: base + 'aes'
		}
	};
}

function secondDeclNoun(orcish, ending, gender) {
	var base = orcish.slice(0, -(ending.length));
	if (ending === 'k') {
		var found = false;
		['a', 'e', 'i', 'o', 'u', 'y'].forEach(function(vowel) {
			if (vowel === orcish[orcish.length - 2]) {
				found = true;
			}
		});
		if (!found) {
			base = orcish;
		}
	}
	if (ending === 'dj') {
		base = orcish;
	}
	return {
		declension: 'second',
		gender: gender,
		nominative: {
			singular: orcish,
			plural: base + 'ulz'
		},
		genitive: {
			singular: base + 'u',
			plural: base + 'urru'
		},
		dative: {
			singular: base + 'o',
			plural: base + 'ors'
		},
		accusative: {
			singular: base + 'udz',
			plural: base + 'uluz'
		},
		vocative: {
			singular: base + 'o',
			plural: base + 'aes'
		}
	};
}

function thirdDeclNoun(orcish, ending) {
	var base = orcish.slice(0, -(ending.length));
	return {
		declension: 'third',
		gender: 'feminine',
		nominative: {
			singular: orcish,
			plural: base + 'alz'
		},
		genitive: {
			singular: base + 'arn',
			plural: base + 'arnu'
		},
		dative: {
			singular: base + 'an',
			plural: base + 'ahan'
		},
		accusative: {
			singular: base + 'ach',
			plural: base + 'arach'
		},
		vocative: {
			singular: base + 'ano',
			plural: base + 'anosh'
		}
	};
}

function fourthDeclNoun(orcish, ending) {
	var base = orcish.slice(0, -(ending.length));
	return {
		declension: 'fourth',
		gender: 'masculine',
		nominative: {
			singular: orcish,
			plural: base + 'elz'
		},
		genitive: {
			singular: base + 'em',
			plural: base + 'errum'
		},
		dative: {
			singular: base + 'e',
			plural: base + 'ero'
		},
		accusative: {
			singular: base + 'enz',
			plural: base + 'eluz'
		},
		vocative: {
			singular: base + 'om',
			plural: base + 'emo'
		}
	};
}

function fifthDeclNoun(orcish, ending) {
	var base = orcish.slice(0, -(ending.length));
	return {
		declension: 'fifth',
		gender: 'neutral',
		nominative: {
			singular: orcish,
			plural: base + 'ataz'
		},
		genitive: {
			singular: base + 'uzu',
			plural: base + 'atsu'
		},
		dative: {
			singular: base + 'ord',
			plural: base + 'oran'
		},
		accusative: {
			singular: base + 'atz',
			plural: base + 'atuz'
		},
		vocative: {
			singular: base + 'ordo',
			plural: base + 'onosh'
		}
	};
}
