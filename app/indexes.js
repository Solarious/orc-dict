'use strict';

var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');

module.exports = {
	rebuild: rebuild,
	forCreate: forCreate,
	forUpdate: forUpdate,
	forRemove: forRemove,
	forRemoveByPoS: forRemoveByPoS,
	forInsertMany: forInsertMany,
	forReplaceMany: forReplaceMany
};

function rebuild() {
	return SearchIndex.remove({})
	.then(function() {
		return Word.find({});
	})
	.then(function(words) {
		return forInsertMany(words);
	});
}

function forCreate(word) {
	var searchIndexes = createIndexesForWord(word);
	return SearchIndex.insertMany(searchIndexes);
}

function forUpdate(prevOrcish, prevNum, word) {
	return SearchIndex.remove({
		'word.orcish': prevOrcish,
		'word.num': prevNum
	})
	.then(function() {
		return forCreate(word);
	});
}

function forRemove(word) {
	return SearchIndex.remove({
		'word.orcish': word.orcish,
		'word.num': word.num
	});
}

function forRemoveByPoS(PoS) {
	if (PoS === 'all') {
		return SearchIndex.remove({});
	} else {
		return SearchIndex.remove({
			'word.PoS': PoS
		});
	}
}

function forInsertMany(words) {
	const sizePerPart = Number(process.env.SIZE_PER_PART || 500);
	var arrays = [];
	var part = [];
	var partSize = 0;
	var promise = Promise.resolve();

	for (let i = 0; i < words.length; i++) {
		let word = words[i];
		let size = 1;
		if (word.PoS === 'noun') { size += 10; }
		if (word.PoS === 'adjective') { size += 20; }
		if (word.PoS === 'verb') { size += 124; }
		if (word.PoS === 'pronoun') { size += 5; }
		part.push(word);
		partSize += size;
		if (partSize > sizePerPart) {
			arrays.push(part);
			part = [];
			partSize = 0;
		}
	}
	if (part.length > 0) {
		arrays.push(part);
	}

	var numOfParts = arrays.length;

	arrays.forEach(function(part, i) {
		promise = promise.then(function() {
			if (process.env.NODE_ENV !== 'test') {
				console.log('rebuilding part ' + (i + 1) + '/' + numOfParts);
			}
			return insertPart(part);
		});
	});
	return promise;
}

function insertPart(words) {
	var searchIndexes = [];
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		searchIndexes = searchIndexes.concat(createIndexesForWord(word));
	}
	return SearchIndex.insertMany(searchIndexes);
}

function createIndexesForWord(word) {
	var searchIndexes = [];
	searchIndexes.push({
		keyword: word.orcish,
		priority: 1,
		message: 'orcish',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	var exLessOrcish = word.orcish.replace('!', '');
	if (word.orcish.indexOf('!') !== -1) {
		searchIndexes.push({
			keyword: exLessOrcish,
			priority: 1,
			message: 'orcish',
			word: {
				orcish: word.orcish,
				english: word.english,
				PoS: word.PoS,
				num: word.num
			}
		});
	}
	if (exLessOrcish.indexOf(' ') !== -1 && word.PoS !== 'adjective') {
		let parts = exLessOrcish.split(' ');
		for (let i = 0; i < parts.length; i++) {
			searchIndexes.push({
				keyword: parts[i],
				priority: 1,
				message: 'orcish',
				word: {
					orcish: word.orcish,
					english: word.english,
					PoS: word.PoS,
					num: word.num
				}
			});
		}
	}
	if (word.PoS === 'noun') {
		addNoun(word, searchIndexes);
	} else if (word.PoS === 'verb') {
		addVerb(word, searchIndexes);
	} else if (word.PoS === 'adjective') {
		addAdjective(word, searchIndexes);
	} else if (word.PoS === 'pronoun') {
		addPronoun(word, searchIndexes);
	} else if (word.PoS === 'prefix') {
		addPrefix(word, searchIndexes);
	} else if (word.PoS === 'suffix') {
		addSuffix(word, searchIndexes);
	} else if (word.PoS === 'copular verb') {
		addCopula(word, searchIndexes);
	}

	return searchIndexes;
}

function forReplaceMany(words) {
	var opts = words.map(function(word) {
		return {
			deleteMany: {
				filter: {
					'word.orcish': word.orcish,
					'word.num': word.num
				}
			}
		};
	});
	return SearchIndex.bulkWrite(opts)
	.then(function() {
		return forInsertMany(words);
	});
}

function addNoun(word, searchIndexes) {
	addNounCase(word, searchIndexes, 'nominative');
	addNounCase(word, searchIndexes, 'genitive');
	addNounCase(word, searchIndexes, 'dative');
	addNounCase(word, searchIndexes, 'accusative');
	addNounCase(word, searchIndexes, 'vocative');
}

function addNounCase(word, searchIndexes, nounCase) {
	searchIndexes.push({
		keyword: word.noun[nounCase].singular,
		priority: 2,
		message: nounCase + ' singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.noun[nounCase].plural,
		priority: 2,
		message: nounCase + ' plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addVerb(word, searchIndexes) {
	searchIndexes.push({
		keyword: word.verb.infinitive.active,
		priority: 2,
		message: 'infinitive active',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.infinitive.passive,
		priority: 2,
		message: 'infinitive passive',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	addVerbVoice(word, searchIndexes, 'active');
	addVerbVoice(word, searchIndexes, 'passive');
	searchIndexes.push({
		keyword: word.verb.imperative.singular,
		priority: 2,
		message: 'inperative singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.imperative.plural,
		priority: 2,
		message: 'inperative plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	addVerbGerund(word, searchIndexes);
	addVerbParticiple(word, searchIndexes, 'feminine');
	addVerbParticiple(word, searchIndexes, 'masculine');
	addVerbAgent(word, searchIndexes, 'feminine');
	addVerbAgent(word, searchIndexes, 'masculine');
	addVerbAgent(word, searchIndexes, 'dishonorable');
}

function addVerbVoice(word, searchIndexes, verbVoice) {
	addVerbConj(word, searchIndexes, verbVoice, 'present');
	addVerbConj(word, searchIndexes, verbVoice, 'past');
	addVerbConj(word, searchIndexes, verbVoice, 'future');
	addVerbConj(word, searchIndexes, verbVoice, 'pastPerfect');
	addVerbConj(word, searchIndexes, verbVoice, 'futurePerfect');
}

function addVerbConj(word, searchIndexes, verbVoice, verbTense) {
	var tense = word.verb[verbVoice][verbTense];
	var tenseStr = verbTense.replace(/([A-Z])/g, ' $1').toLowerCase();
	searchIndexes.push({
		keyword: tense.first.singular,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 1st person singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.first.plural,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 1st person plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.second.singular,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 2nd person singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.second.plural,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 2nd person plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.third.singular,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 3rd person singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.third.plural,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 3rd person plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addVerbGerund(word, searchIndexes) {
	addVerbGerundCase(word, searchIndexes, 'nominative');
	addVerbGerundCase(word, searchIndexes, 'genitive');
	addVerbGerundCase(word, searchIndexes, 'dative');
	addVerbGerundCase(word, searchIndexes, 'accusative');
	addVerbGerundCase(word, searchIndexes, 'vocative');
}

function addVerbGerundCase(word, searchIndexes, gerundCase) {
	searchIndexes.push({
		keyword: word.verb.gerund[gerundCase].singular,
		priority: 3,
		message: 'gerund ' + gerundCase + ' singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.gerund[gerundCase].plural,
		priority: 3,
		message: 'gerund ' + gerundCase + ' plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addVerbParticiple(word, searchIndexes, gender) {
	addVerbParticipleCase(word, searchIndexes, gender, 'nominative');
	addVerbParticipleCase(word, searchIndexes, gender, 'genitive');
	addVerbParticipleCase(word, searchIndexes, gender, 'dative');
	addVerbParticipleCase(word, searchIndexes, gender, 'accusative');
	addVerbParticipleCase(word, searchIndexes, gender, 'vocative');
}

function addVerbParticipleCase(word, searchIndexes, gender, pCase) {
	var caseStr = pCase.replace(/([A-Z])/g, '/$1').toLowerCase();
	searchIndexes.push({
		keyword: word.verb.participle[gender][pCase].singular,
		priority: 3,
		message: 'participle ' + gender + ' ' + caseStr + ' singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.participle[gender][pCase].plural,
		priority: 3,
		message: 'participle ' + gender + ' ' + caseStr + ' plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addVerbAgent(word, searchIndexes, type) {
	addVerbAgentCase(word, searchIndexes, type, 'nominative');
	addVerbAgentCase(word, searchIndexes, type, 'genitive');
	addVerbAgentCase(word, searchIndexes, type, 'dative');
	addVerbAgentCase(word, searchIndexes, type, 'accusative');
	addVerbAgentCase(word, searchIndexes, type, 'vocative');
}

function addVerbAgentCase(word, searchIndexes, type, agentCase) {
	searchIndexes.push({
		keyword: word.verb.agent[type][agentCase].singular,
		priority: 3,
		message: 'agent ' + type + ' ' + agentCase + ' singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.agent[type][agentCase].plural,
		priority: 3,
		message: 'agent ' + type + ' ' + agentCase + ' plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addAdjective(word, searchIndexes) {
	addAdjectiveGender(word, searchIndexes, 'feminine');
	addAdjectiveGender(word, searchIndexes, 'masculine');
}

function addAdjectiveGender(word, searchIndexes, gender) {
	addAdjectiveCase(word, searchIndexes, gender, 'nominative');
	addAdjectiveCase(word, searchIndexes, gender, 'genitive');
	addAdjectiveCase(word, searchIndexes, gender, 'dative');
	addAdjectiveCase(word, searchIndexes, gender, 'accusative');
	addAdjectiveCase(word, searchIndexes, gender, 'vocative');
}

function addAdjectiveCase(word, searchIndexes, gender, adjectiveCase) {
	var caseStr = adjectiveCase.replace(/([A-Z])/g, '/$1').toLowerCase();
	searchIndexes.push({
		keyword: word.adjective[gender][adjectiveCase].singular,
		priority: 2,
		message: gender + ' ' + caseStr + ' singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.adjective[gender][adjectiveCase].plural,
		priority: 2,
		message: gender + ' ' + caseStr + ' plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addPronoun(word, searchIndexes) {
	addCase(word, searchIndexes, 'nominative');
	addCase(word, searchIndexes, 'genitive');
	addCase(word, searchIndexes, 'dative');
	addCase(word, searchIndexes, 'accusative');
	addCase(word, searchIndexes, 'vocative');
}

function addCase(word, searchIndexes, caseName) {
	searchIndexes.push({
		keyword: word.pronoun[caseName],
		priority: 2,
		message: caseName,
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addPrefix(word, searchIndexes) {
	var affixLimits = [];
	word.affix.limits.forEach(function(limit) {
		affixLimits.push(limit.PoS);
	});
	searchIndexes.push({
		keyword: word.orcish.replace(/\W/g, ''),
		priority: 4,
		message: 'prefix',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		},
		affix: 'prefix',
		affixLimits: affixLimits
	});
}

function addSuffix(word, searchIndexes) {
	var affixLimits = [];
	word.affix.limits.forEach(function(limit) {
		affixLimits.push(limit.PoS);
	});
	searchIndexes.push({
		keyword: word.orcish.replace(/\W/g, ''),
		priority: 4,
		message: 'suffix',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		},
		affix: 'suffix',
		affixLimits: affixLimits
	});
}

function addCopula(word, searchIndexes) {
	addCopulaConj(word, searchIndexes, 'present');
	addCopulaConj(word, searchIndexes, 'past');
	addCopulaConj(word, searchIndexes, 'future');
	addCopulaGerund(word, searchIndexes);
	searchIndexes.push({
		keyword: word.copula.infinitive.present,
		priority: 2,
		message: 'present infinitive',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.copula.infinitive.future,
		priority: 2,
		message: 'future infinitive',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addCopulaConj(word, searchIndexes, verbTense) {
	var tense = word.copula[verbTense];
	searchIndexes.push({
		keyword: tense.first.singular,
		priority: 2,
		message: verbTense + ' 1st person singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.first.plural,
		priority: 2,
		message: verbTense + ' 1st person plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.second.singular,
		priority: 2,
		message: verbTense + ' 2nd person singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.second.plural,
		priority: 2,
		message: verbTense + ' 2nd person plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.third.singular,
		priority: 2,
		message: verbTense + ' 3rd person singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: tense.third.plural,
		priority: 2,
		message: verbTense + ' 3rd person plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

function addCopulaGerund(word, searchIndexes) {
	addCopulaGerundCase(word, searchIndexes, 'nominative');
	addCopulaGerundCase(word, searchIndexes, 'genitive');
	addCopulaGerundCase(word, searchIndexes, 'dative');
	addCopulaGerundCase(word, searchIndexes, 'accusative');
	addCopulaGerundCase(word, searchIndexes, 'vocative');
}

function addCopulaGerundCase(word, searchIndexes, gerundCase) {
	searchIndexes.push({
		keyword: word.copula.gerund[gerundCase].singular,
		priority: 3,
		message: 'gerund ' + gerundCase + ' singular',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.copula.gerund[gerundCase].plural,
		priority: 3,
		message: 'gerund ' + gerundCase + ' plural',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}
