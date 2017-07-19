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

function forReplaceMany(words) {
	var opts = words.map(function(word) {
		return {
			deleteMany: {
				filter: {
					'word.orcish': word.orcish,
					'word.PoS': word.PoS
				}
			}
		};
	});
	return SearchIndex.bulkWrite(opts)
	.then(function() {
		return forInsertMany(words);
	});
}

function createIndexesForWord(word) {
	var searchIndexes = [];
	
	var noOrcishIndex = [
		'copular verb',
		'noun',
		'pronoun',
		'verb'
	];
	if (noOrcishIndex.indexOf(word.PoS) === -1) {
		// skip non declining adjectives
		if (word.PoS !== 'adjective' || (word.orcish.indexOf(' ') !== -1)) {
			pushIndex(
				searchIndexes, word.orcish, 1,
				'orcish', word
			);
		}
	}

	var exLessOrcish = word.orcish.replace('!', '');
	if (word.orcish.indexOf('!') !== -1) {
		pushIndex(
			searchIndexes, exLessOrcish, 1,
			'orcish', word
		);
	}
	if (exLessOrcish.indexOf(' ') !== -1 && word.PoS !== 'adjective') {
		let parts = exLessOrcish.split(' ');
		for (let i = 0; i < parts.length; i++) {
			pushIndex(
				searchIndexes, parts[i], 1,
				'orcish', word
			);
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

// -----------------------------------------------------------------
// Functions used by createIndexesForWord and their helper functions
// -----------------------------------------------------------------

function pushIndex(searchIndexes, keyword, priority, message, word) {
	searchIndexes.push({
		keyword: keyword,
		priority: priority,
		message: message,
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
}

// -----
// Nouns
// -----

function addNoun(word, searchIndexes) {
	if (nounDoesNotDecline(word)) {
		pushIndex(searchIndexes, word.orcish, 2, 'all cases', word);
	} else {
		addNounCase(word, searchIndexes, 'nominative', 2);
		addNounCase(word, searchIndexes, 'genitive', 2);
		addNounCase(word, searchIndexes, 'dative', 2);
		addNounCase(word, searchIndexes, 'accusative', 2);
		addNounCase(word, searchIndexes, 'vocative', 2.5);
	}
}

function nounDoesNotDecline(word) {
	return (word.orcish === word.noun.nominative.singular &&
	word.orcish === word.noun.nominative.plural &&
	word.orcish === word.noun.genitive.singular &&
	word.orcish === word.noun.genitive.plural &&
	word.orcish === word.noun.dative.singular &&
	word.orcish === word.noun.dative.plural &&
	word.orcish === word.noun.accusative.singular &&
	word.orcish === word.noun.accusative.plural &&
	word.orcish === word.noun.vocative.singular &&
	word.orcish === word.noun.vocative.plural);
}

function addNounCase(word, searchIndexes, nounCase, priority) {
	pushIndex(
		searchIndexes, word.noun[nounCase].singular, priority,
		nounCase + ' singular', word
	);
	pushIndex(
		searchIndexes, word.noun[nounCase].plural, priority,
		nounCase + ' plural', word
	);
}

// -----
// Verbs
// -----

function addVerb(word, searchIndexes) {
	pushIndex(
		searchIndexes, word.verb.infinitive.active, 2,
		'infinitive active', word
	);
	pushIndex(
		searchIndexes, word.verb.infinitive.passive, 2,
		'infinitive passive', word
	);
	pushIndex(
		searchIndexes, word.verb.imperative.singular, 2,
		'inperative singular', word
	);
	pushIndex(
		searchIndexes, word.verb.imperative.plural, 2,
		'inperative plural', word
	);
	addVerbVoice(word, searchIndexes, 'active');
	addVerbVoice(word, searchIndexes, 'passive');
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
	pushIndex(
		searchIndexes, tense.first.singular, 2,
		tenseStr + ' ' + verbVoice + ' 1st person singular', word
	);
	pushIndex(
		searchIndexes, tense.first.plural, 2,
		tenseStr + ' ' + verbVoice + ' 1st person plural', word
	);
	pushIndex(
		searchIndexes, tense.second.singular, 2,
		tenseStr + ' ' + verbVoice + ' 2nd person singular', word
	);
	pushIndex(
		searchIndexes, tense.second.plural, 2,
		tenseStr + ' ' + verbVoice + ' 2nd person plural', word
	);
	pushIndex(
		searchIndexes, tense.third.singular, 2,
		tenseStr + ' ' + verbVoice + ' 3rd person singular', word
	);
	pushIndex(
		searchIndexes, tense.third.plural, 2,
		tenseStr + ' ' + verbVoice + ' 3rd person plural', word
	);
}

function addVerbGerund(word, searchIndexes) {
	addVerbGerundCase(word, searchIndexes, 'nominative', 3);
	addVerbGerundCase(word, searchIndexes, 'genitive', 3);
	addVerbGerundCase(word, searchIndexes, 'dative', 3);
	addVerbGerundCase(word, searchIndexes, 'accusative', 3);
	addVerbGerundCase(word, searchIndexes, 'vocative', 3.5);
}

function addVerbGerundCase(word, searchIndexes, gerundCase, priority) {
	pushIndex(
		searchIndexes, word.verb.gerund[gerundCase].singular, priority,
		'gerund ' + gerundCase + ' singular', word
	);
	pushIndex(
		searchIndexes, word.verb.gerund[gerundCase].plural, priority,
		'gerund ' + gerundCase + ' plural', word
	);
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
	pushIndex(
		searchIndexes, word.verb.participle[gender][pCase].singular, 3,
		'participle ' + gender + ' ' + caseStr + ' singular', word
	);
	pushIndex(
		searchIndexes, word.verb.participle[gender][pCase].plural, 3,
		'participle ' + gender + ' ' + caseStr + ' plural', word
	);
}

function addVerbAgent(word, searchIndexes, type) {
	addVerbAgentCase(word, searchIndexes, type, 'nominative', 3);
	addVerbAgentCase(word, searchIndexes, type, 'genitive', 3);
	addVerbAgentCase(word, searchIndexes, type, 'dative', 3);
	addVerbAgentCase(word, searchIndexes, type, 'accusative', 3);
	addVerbAgentCase(word, searchIndexes, type, 'vocative', 3.5);
}

function addVerbAgentCase(word, searchIndexes, type, agentCase, priority) {
	pushIndex(
		searchIndexes, word.verb.agent[type][agentCase].singular, priority,
		'agent ' + type + ' ' + agentCase + ' singular', word
	);
	pushIndex(
		searchIndexes, word.verb.agent[type][agentCase].plural, priority,
		'agent ' + type + ' ' + agentCase + ' plural', word
	);
}

// ----------
// Adjectives
// ----------

function addAdjective(word, searchIndexes) {
	if (adjectiveDoesNotDecline(word)) {
		pushIndex(
			searchIndexes, word.orcish, 2,
			'all cases and genders', word
		);
	} else {
		addAdjectiveGender(word, searchIndexes, 'feminine');
		addAdjectiveGender(word, searchIndexes, 'masculine');
	}
}

function adjectiveDoesNotDecline(word) {
	return (word.orcish.indexOf(' ') === -1);
}

function addAdjectiveGender(word, searchIndexes, gender) {
	addAdjectiveCase(word, searchIndexes, gender, 'nominative', 2);
	addAdjectiveCase(word, searchIndexes, gender, 'genitive', 2);
	addAdjectiveCase(word, searchIndexes, gender, 'dative', 2);
	addAdjectiveCase(word, searchIndexes, gender, 'accusative', 2);
	addAdjectiveCase(word, searchIndexes, gender, 'vocative', 2.5);
}

function addAdjectiveCase(word, searchIndexes, gender, adjCase, priority) {
	var caseStr = adjCase.replace(/([A-Z])/g, '/$1').toLowerCase();
	pushIndex(
		searchIndexes, word.adjective[gender][adjCase].singular, priority,
		gender + ' ' + caseStr + ' singular', word
	);
	pushIndex(
		searchIndexes, word.adjective[gender][adjCase].plural, priority,
		gender + ' ' + caseStr + ' plural', word
	);
}

// --------
// Pronouns
// --------

function addPronoun(word, searchIndexes) {
	addCase(word, searchIndexes, 'nominative', 2);
	addCase(word, searchIndexes, 'genitive', 2);
	addCase(word, searchIndexes, 'dative', 2);
	addCase(word, searchIndexes, 'accusative', 2);
	addCase(word, searchIndexes, 'vocative', 2.5);
}

function addCase(word, searchIndexes, caseName, priority) {
	pushIndex(
		searchIndexes, word.pronoun[caseName], priority,
		caseName, word
	);
}

// -------
// Affixes
// -------

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

// -------------
// Copular Verbs
// -------------

function addCopula(word, searchIndexes) {
	addCopulaConj(word, searchIndexes, 'present');
	addCopulaConj(word, searchIndexes, 'past');
	addCopulaConj(word, searchIndexes, 'future');
	addCopulaGerund(word, searchIndexes);
	pushIndex(
		searchIndexes, word.copula.infinitive.present, 0,
		'present infinitive', word
	);
	pushIndex(
		searchIndexes, word.copula.infinitive.future, 0,
		'future infinitive', word
	);
}

function addCopulaConj(word, searchIndexes, verbTense) {
	var tense = word.copula[verbTense];
	pushIndex(
		searchIndexes, tense.first.singular, 0,
		verbTense + ' 1st person singular', word
	);
	pushIndex(
		searchIndexes, tense.first.plural, 0,
		verbTense + ' 1st person plural', word
	);
	pushIndex(
		searchIndexes, tense.second.singular, 0,
		verbTense + ' 2nd person singular', word
	);
	pushIndex(
		searchIndexes, tense.second.plural, 0,
		verbTense + ' 2nd person plural', word
	);
	pushIndex(
		searchIndexes, tense.third.singular, 0,
		verbTense + ' 3rd person singular', word
	);
	pushIndex(
		searchIndexes, tense.third.plural, 0,
		verbTense + ' 3rd person plural', word
	);
}

function addCopulaGerund(word, searchIndexes) {
	addCopulaGerundCase(word, searchIndexes, 'nominative', 3);
	addCopulaGerundCase(word, searchIndexes, 'genitive', 3);
	addCopulaGerundCase(word, searchIndexes, 'dative', 3);
	addCopulaGerundCase(word, searchIndexes, 'accusative', 3);
	addCopulaGerundCase(word, searchIndexes, 'vocative', 3.5);
}

function addCopulaGerundCase(word, searchIndexes, gerundCase, priority) {
	pushIndex(
		searchIndexes, word.copula.gerund[gerundCase].singular, priority,
		'gerund ' + gerundCase + ' singular', word
	);
	pushIndex(
		searchIndexes, word.copula.gerund[gerundCase].plural, priority,
		'gerund ' + gerundCase + ' plural', word
	);
}
