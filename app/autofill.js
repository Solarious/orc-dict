'use strict';

var Word = require('./models/word');

module.exports = function(orcish, PoS, callback) {
	if (PoS === 'verb') {
		getVerb(orcish, callback);
	} else if (PoS === 'noun') {
		getNoun(orcish, callback);
	} else if (PoS === 'adjective') {
		getAdjective(orcish, callback);
	} else if (PoS === 'adverb') {
		callback(new Error('Can not use autofill with PoS: adverb'));
	} else if (PoS === 'cardinal') {
		callback(new Error('Can not use autofill with PoS: cardinal'));
	} else if (PoS === 'conjunction') {
		callback(new Error('Can not use autofill with PoS: conjunction'));
	} else if (PoS === 'demonstrative') {
		callback(new Error('Can not use autofill with PoS: demonstrative'));
	} else if (PoS === 'exclamation') {
		callback(new Error('Can not use autofill with PoS: exclamation'));
	} else if (PoS === 'interjection') {
		callback(new Error('Can not use autofill with PoS: interjection'));
	} else if (PoS === 'possessive') {
		callback(new Error('Can not use autofill with PoS: possessive'));
	} else if (PoS === 'preposition') {
		callback(new Error('Can not use autofill with PoS: preposition'));
	} else if (PoS === 'pronoun') {
		callback(new Error('Can not use autofill with PoS: pronoun'));
	} else if (PoS === 'relative') {
		callback(new Error('Can not use autofill with PoS: relative'));
	} else if (PoS === 'prefix') {
		callback(new Error('Can not use autofill with PoS: prefix'));
	} else if (PoS === 'suffix') {
		callback(new Error('Can not use autofill with PoS: suffix'));
	} else {
		return callback(new Error('Invalid PoS: ' + PoS));
	}
};// module.exports

var vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

function isVowel(letter) {
	return (vowels.indexOf(letter) !== -1);
}

function getVerb(orcish, callback) {
	if (orcish.endsWith('a')) {
		return callback(null, firstConjVerb(orcish));
	} else if (orcish.endsWith('ai')) {
		return callback(null, secondConjVerb(orcish));
	} else {
		return callback(
			new Error('Word ' + orcish + ' has no valid conjugation')
		);
	}
}

function getNoun(orcish, callback) {
	var endings;

	endings = ['ad', 'am', 'ag', 'aed'];
	for (let i = 0; i < endings.length; i++) {
		let ending = endings[i];
		if (orcish.endsWith(ending)) {
			return callback(null, firstDeclNoun(orcish, ending));
		}
	}

	endings = ['ul', 'or', 'k', 'x'];
	for (let i = 0; i < endings.length; i++) {
		let ending = endings[i];
		if (orcish.endsWith(ending)) {
			return callback(
				null, secondDeclNoun(orcish, ending, 'masculine')
			);
		}
	}

	endings = ['id', 'ed', 'd', 'z', 'dj'];
	for (let i = 0; i < endings.length; i++) {
		let ending = endings[i];
		if (orcish.endsWith(ending)) {
			return callback(
				null, secondDeclNoun(orcish, ending, 'neutral')
			);
		}
	}

	endings = ['ash', 'ard', 'rd'];
	for (let i = 0; i < endings.length; i++) {
		let ending = endings[i];
		if (orcish.endsWith(ending)) {
			return callback(null, thirdDeclNoun(orcish, ending));
		}
	}

	endings = ['b', 'f', 'p'];
	for (let i = 0; i < endings.length; i++) {
		let ending = endings[i];
		if (orcish.endsWith(ending)) {
			return callback(null, fourthDeclNoun(orcish, ending));
		}
	}

	endings = ['ath', 'at'];
	for (let i = 0; i < endings.length; i++) {
		let ending = endings[i];
		if (orcish.endsWith(ending)) {
			return callback(null, fifthDeclNoun(orcish, ending));
		}
	}

	return callback(new Error(orcish + ' has no valid declension'));
}

function getAdjective(orcish, callback) {
	var parts = orcish.split(', ');
	if (parts.length !== 2) {
		return callback(new Error(
			'Word ' + orcish + ' must have format feminine, masculine or' +
			' feminine, -masculineEnding'
		));
	}
	var feminineOrcish = parts[0];
	var mascNeutOrcish = parts[1];
	if (mascNeutOrcish[0] === '-') {
		mascNeutOrcish = mascNeutOrcish.slice(1);
		var endLen = mascNeutOrcish.length;
		mascNeutOrcish = feminineOrcish.slice(0, -endLen) + mascNeutOrcish;
	}
	var error;
	var feminineData;
	var mascNeutData;
	getNoun(feminineOrcish, function(err, data) {
		err = error;
		feminineData = data;
	});
	if (error) {
		return callback(new Error(
			'Word ' + orcish + ' feminine part had error ' + error.message
		));
	}
	getNoun(mascNeutOrcish, function(err, data) {
		error = err;
		mascNeutData = data;
	});
	if (error) {
		return callback(new Error(
			'Word ' + orcish + ' masculine/neutral part had error ' +
			error.message
		));
	}

	callback(null, {
		feminine: nounToAdjectivePart(feminineData),
		masculineNeutral: nounToAdjectivePart(mascNeutData)
	});
}

function nounToAdjectivePart(noun) {
	return {
		nominative: noun.nominative,
		genitive: noun.genitive,
		dative: noun.dative,
		accusative: noun.accusative,
		vocative: noun.vocative
	};
}

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
			masculine: base + 'ak',
			dishonorable: orcish + 'dj'
		}
	};
}

function firstDeclNoun(orcish, ending) {
	var base = orcish.slice(0, -(ending.length));
	var accusativeEnding = (ending === 'am') ? 'adz' : 'az';

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
	var lastLetterOfBase = base[base.length - 1];
	var nominativePlural = (gender === 'masculine') ? 'ulz' : 'idz';
	var dativeVocativePlural = (gender === 'masculine') ? 'ors' : 'aes';

	if (ending === 'k') {
		if (!isVowel(lastLetterOfBase)) {
			base = orcish;
		}
	}
	if (ending === 'dj') {
		base = orcish;
	} else if (!isVowel(ending[0]) && isVowel(lastLetterOfBase)) {
		base = base.slice(0, -1);
	}

	return {
		declension: 'second',
		gender: gender,
		nominative: {
			singular: orcish,
			plural: base + nominativePlural
		},
		genitive: {
			singular: base + 'u',
			plural: base + 'urru'
		},
		dative: {
			singular: base + 'o',
			plural: base + dativeVocativePlural
		},
		accusative: {
			singular: base + 'udz',
			plural: base + 'uluz'
		},
		vocative: {
			singular: base + 'o',
			plural: base + dativeVocativePlural
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
	var lastLetterOfBase = base[base.length - 1];

	if (isVowel(lastLetterOfBase)) {
		base = base.slice(0, -1);
	}

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
