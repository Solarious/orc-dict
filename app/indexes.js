'use strict';

var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');
var stats = require('./stats');
var config = require('../config');

module.exports = {
	rebuild: rebuild,
	forCreate: forCreate,
	forUpdate: forUpdate,
	forRemove: forRemove,
	forRemoveByPoS: forRemoveByPoS,
	forInsertMany: forInsertMany,
	forReplaceMany: forReplaceMany
};

async function rebuild() {
	await SearchIndex.deleteMany({});

	var skip = 0;
	var words;

	while (true) {
		words = await Word.find({})
			.sort({ id: 'asc' })
			.skip(skip)
			.limit(config.MAX_WORDS_LOAD)
			.lean()
			.exec();
		if (words.length == 0) break;
		skip += words.length;

		await forInsertMany(words);
	}

	return stats;
}

function forCreate(word) {
	var searchIndexes = createIndexesForWord(word);
	return SearchIndex.insertMany(searchIndexes)
	.then(function(data) {
		stats.setKeywordsNeedsUpdate();
		return data;
	});
}

function forUpdate(prevOrcish, prevNum, word) {
	return SearchIndex.deleteMany({
		'word.orcish': prevOrcish,
		'word.num': prevNum
	})
	.then(function() {
		return forCreate(word);
	});
}

function forRemove(word) {
	return SearchIndex.deleteMany({
		'word.orcish': word.orcish,
		'word.num': word.num
	})
	.then(function(data) {
		stats.setKeywordsNeedsUpdate();
		return data;
	});
}

function forRemoveByPoS(PoS) {
	var args = (PoS === 'all') ? {} : { 'word.PoS': PoS };

	return SearchIndex.deleteMany(args)
	.then(function(data) {
		stats.setKeywordsNeedsUpdate();
		return data;
	});
}

function forInsertMany(words) {
	const sizePerPart = Number(config.SIZE_PER_PART);
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
			if (config.NODE_ENV !== 'test') {
				console.log('rebuilding part ' + (i + 1) + '/' + numOfParts);
			}
			return insertPart(part);
		});
	});
	return promise
	.then(function(data) {
		stats.setKeywordsNeedsUpdate();
		return data;
	});
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
	var decl = word.noun.declension;
	if (nounDoesNotDecline(word)) {
		pushIndex(searchIndexes, word.orcish, 2, 'all cases', word);
	} else if (decl === 'first' || decl === 'second') {
		addNounCase(word, searchIndexes, 'nominative', 2);
		addNounCase(word, searchIndexes, 'genitive', 2);
		pushIndex(
			searchIndexes, word.noun.dative.singular, 2,
			'dative/vocative singular', word
		);
		pushIndex(
			searchIndexes, word.noun.dative.plural, 2,
			' dative/vocative plural', word
		);
		addNounCase(word, searchIndexes, 'accusative', 2);
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
	addVerbInfinitives(word, searchIndexes);
	pushIndex(
		searchIndexes, word.verb.imperative.singular, 2,
		'imperative singular', word
	);
	pushIndex(
		searchIndexes, word.verb.imperative.plural, 2,
		'imperative plural', word
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

function addVerbInfinitives(word, searchIndexes) {
	addVerbInfinitiveVoice(word, searchIndexes, 'active');
	addVerbInfinitiveVoice(word, searchIndexes, 'passive');
}

function addVerbInfinitiveVoice(word, searchIndexes, voice) {
	pushIndex(
		searchIndexes, word.verb.infinitive[voice].present, 2,
		voice + ' present infinitive', word
	);
	pushIndex(
		searchIndexes, word.verb.infinitive[voice].past, 2,
		voice + ' past infinitive', word
	);
	pushIndex(
		searchIndexes, word.verb.infinitive[voice].future, 2,
		voice + ' future infinitive', word
	);
	pushIndex(
		searchIndexes, word.verb.infinitive[voice].pastPerfect, 2,
		voice + ' past perfect infinitive', word
	);
	pushIndex(
		searchIndexes, word.verb.infinitive[voice].futurePerfect, 2,
		voice + ' future perfect infinitive', word
	);
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
	pushIndex(
		searchIndexes, word.verb.gerund.dative.singular, 3,
		'gerund dative/vocative singular', word
	);
	pushIndex(
		searchIndexes, word.verb.gerund.dative.plural, 3,
		'gerund dative/vocative plural', word
	);
	addVerbGerundCase(word, searchIndexes, 'accusative', 3);
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
	pushIndex(
		searchIndexes, word.verb.participle[gender].dative.singular, 3,
		'participle ' + gender + ' dative/vocative singular', word
	);
	pushIndex(
		searchIndexes, word.verb.participle[gender].dative.plural, 3,
		'participle ' + gender + ' dative/vocative plural', word
	);
	addVerbParticipleCase(word, searchIndexes, gender, 'accusative');
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
	pushIndex(
		searchIndexes, word.verb.agent[type].dative.singular, 3,
		'agent ' + type + ' dative/vocative singular', word
	);
	pushIndex(
		searchIndexes, word.verb.agent[type].dative.plural, 3,
		'agent ' + type + ' dative/vocative plural', word
	);
	addVerbAgentCase(word, searchIndexes, type, 'accusative', 3);
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
	var d = word.adjective[gender].dative;
	var v = word.adjective[gender].vocative;
	if ((d.singular === v.singular) && (d.plural === v.plural)) {
		addAdjectiveCase(word, searchIndexes, gender, 'nominative', 2);
		addAdjectiveCase(word, searchIndexes, gender, 'genitive', 2);
		pushIndex(
			searchIndexes, word.adjective[gender].dative.singular, 2,
			gender + ' dative/vocative singular', word
		);
		pushIndex(
			searchIndexes, word.adjective[gender].dative.plural, 2,
			gender + ' dative/vocative plural', word
		);
		addAdjectiveCase(word, searchIndexes, gender, 'accusative', 2);
	} else {
		addAdjectiveCase(word, searchIndexes, gender, 'nominative', 2);
		addAdjectiveCase(word, searchIndexes, gender, 'genitive', 2);
		addAdjectiveCase(word, searchIndexes, gender, 'dative', 2);
		addAdjectiveCase(word, searchIndexes, gender, 'accusative', 2);
		addAdjectiveCase(word, searchIndexes, gender, 'vocative', 2.5);
	}
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
	if (word.pronoun.dative === word.pronoun.vocative) {
		addCase(word, searchIndexes, 'nominative', 2);
		addCase(word, searchIndexes, 'genitive', 2);
		pushIndex(
			searchIndexes, word.pronoun.dative, 2,
			'dative/vocative', word
		);
		addCase(word, searchIndexes, 'accusative', 2);
	} else {
		addCase(word, searchIndexes, 'nominative', 2);
		addCase(word, searchIndexes, 'genitive', 2);
		addCase(word, searchIndexes, 'dative', 2);
		addCase(word, searchIndexes, 'accusative', 2);
		addCase(word, searchIndexes, 'vocative', 2.5);
	}
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
	pushIndex(
		searchIndexes, word.copula.gerund.dative.singular, 3,
		'gerund dative/vocative singular', word
	);
	pushIndex(
		searchIndexes, word.copula.gerund.dative.plural, 3,
		'gerund dative/vocative plural', word
	);
	addCopulaGerundCase(word, searchIndexes, 'accusative', 3);
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
