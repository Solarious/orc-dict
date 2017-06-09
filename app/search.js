'use strict';

var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');

module.exports = {
	getMatches: getMatches,
	getSearchIndexes: getSearchIndexes,
	rebuild: rebuild,
	getAll: getAll,
	forCreate: forCreate,
	forUpdate: forUpdate,
	forRemove: forRemove,
	forRemoveByPoS: forRemoveByPoS,
	forInsertMany: forInsertMany,
	forReplaceMany: forReplaceMany
};

function getMatches(text) {
	var regex = /[^\s"]+|"([^"]*)"/g;
	var match;
	var searches = [];
	while ((match = regex.exec(text.toLowerCase()))) {
		var s = match[1] ? match[1] : match[0];
		s = s.replace(/^[\.\,]/, '');
		s = s.replace(/[\.\,]$/, '');
		if (s) {
			searches.push(s);
		}
	}

	var promises = [];
	for (var i = 0; i < searches.length; i++) {
		promises.push(getTransformedSearchIndexes(searches[i]));
	}
	return Promise.all(promises)
	.then(function(data) {
		var results = [];
		for (var i = 0; i < searches.length; i++) {
			results.push({
				str: searches[i],
				matches: data[i]
			});
		}
		return results;
	});
}

function getTransformedSearchIndexes(searchString) {
	function sortFun(a, b) {
		var aHasDash = a && (a[0] === '-');
		var bHasDash = b && (b[0] === '-');
		if (aHasDash && bHasDash) {
			return sortFun(a.slice(1), b.slice(1));
		}
		if (aHasDash) {
			return 1;
		}
		if (bHasDash) {
			return -1;
		}
		return a.localeCompare(b);
	}

	return getSearchIndexes(searchString)
	.then(function(matches) {
		var usedAffixes = [];
		var dictOfUsedAffixes = {};
		matches.forEach(function(match) {
			if (match.withAffixes && (match.withAffixes.length > 0)) {
				let afs = match.withAffixes.map(function(affix) {
					return affix.word.orcish;
				});
				afs.sort(sortFun);
				match.withAffixes.forEach(function(affix) {
					if (!dictOfUsedAffixes[affix.word.orcish]) {
						usedAffixes.push(affix);
						dictOfUsedAffixes[affix.word.orcish] = true;
					}
				});
				var n = '(with ' + afs.join(', ') + ') ' + match.message;
				match.message = n;
				delete match.withAffixes;
			}
		});
		var found = {};
		var filteredMatches = matches.filter(function(match) {
			var f = found[match.word.orcish] || [];
			for (let i = 0; i < f.length; i++) {
				let fi = f[i];
				if (fi.num === match.word.num && fi.message === match.message) {
					return false;
				}
			}
			found[match.word.orcish] = f;
			found[match.word.orcish].push({
				message: match.message,
				num: match.word.num
			});
			return true;
		});
		usedAffixes.sort(function(a, b) {
			return sortFun(a.word.orcish, b.word.orcish);
		});
		return usedAffixes.concat(filteredMatches);
	});
}

function getSearchIndexes(searchString) {
	return Promise.all([
		SearchIndex.getMatches(searchString),
		getAffixMatches(searchString)
	])
	.then(function(data) {
		return data[0].concat(data[1]);
	});
}

function getAffixMatches(str) {
	var affixWords;
	return SearchIndex.getMatchesWithAffix('all')
	.then(function(results) {
		affixWords = results.filter(function(affixWord) {
			if (affixWord.affix === 'prefix') {
				return str.startsWith(affixWord.word.orcish.replace(/\W/g, ''));
			} else {
				return str.endsWith(affixWord.word.orcish.replace(/\W/g, ''));
			}
		});
		var promises = affixWords.map(function(affixWord) {
			var affix = affixWord.word.orcish.replace(/\W/g, '');
			if (affixWord.affix === 'prefix') {
				return getSearchIndexes(str.slice(affix.length));
			} else {
				return getSearchIndexes(str.slice(0, -affix.length));
			}
		});
		return Promise.all(promises);
	})
	.then(function(matches) {
		var results = [];
		function filterFun(limits) {
			return function(match) {
				return (limits.indexOf(match.word.PoS) !== -1);
			};
		}
		for (let i = 0; i < matches.length; i++) {
			let affixWord = affixWords[i];
			let matchesForAffix = matches[i];
			if (affixWord.affixLimits.length > 0) {
				matchesForAffix = matchesForAffix.filter(
					filterFun(affixWord.affixLimits)
				);
			}
			if (matchesForAffix.length > 0) {
				for (let j = 0; j < matchesForAffix.length; j++) {
					let match = matchesForAffix[j];
					match.withAffixes = match.withAffixes || [];
					match.withAffixes.push(affixWord);
					results.push(match);
				}
			}
		}
		return results;
	});
}

function rebuild() {
	return SearchIndex.remove({})
	.then(function() {
		return Word.find({});
	})
	.then(function(words) {
		return forInsertMany(words);
	});
}

function rebuildPart(words) {
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
	searchIndexes.push({
		keyword: word.english,
		priority: 1,
		message: 'english',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
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
	}

	addKeywords(word, searchIndexes);

	return searchIndexes;
}

function getAll(callback) {
	SearchIndex.find({}, callback);
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
	const numPerPart = 100;
	var arrays = [];
	var p = Promise.resolve();

	for (let i = 0; i < words.length; i += numPerPart) {
		arrays.push(words.slice(i, i + numPerPart));
	}

	if (process.env.NODE_ENV !== 'test') {
		if (arrays.length === 1) {
			console.log('There is 1 part to rebuild');
		} else {
			console.log('There are ' + arrays.length + ' parts to rebuild');
		}
	}

	arrays.forEach(function(part, i) {
		p = p.then(function() {
			if (process.env.NODE_ENV !== 'test') {
				console.log('rebuilding part ' + (i + 1));
			}
			return rebuildPart(part);
		});
	});
	return p;
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
	searchIndexes.push({
		keyword: word.verb.gerund,
		priority: 3,
		message: 'gerund',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.participle.feminine,
		priority: 3,
		message: 'participle feminine',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.participle.masculine,
		priority: 3,
		message: 'participle masculine',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.agent.feminine,
		priority: 3,
		message: 'agent feminine',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.agent.masculine,
		priority: 3,
		message: 'agent masculine',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
	searchIndexes.push({
		keyword: word.verb.agent.dishonorable,
		priority: 3,
		message: 'agent dishonorable',
		word: {
			orcish: word.orcish,
			english: word.english,
			PoS: word.PoS,
			num: word.num
		}
	});
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

function addAdjective(word, searchIndexes) {
	addAdjectiveGender(word, searchIndexes, 'feminine');
	addAdjectiveGender(word, searchIndexes, 'masculineNeutral');
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

function addKeywords(word, searchIndexes) {
	for (let i = 0; i < word.keywords.length; i++) {
		let keyword = word.keywords[i];
		searchIndexes.push({
			keyword: keyword.keyword,
			priority: keyword.priority,
			message: keyword.message,
			word: {
				orcish: word.orcish,
				english: word.english,
				PoS: word.PoS,
				num: word.num
			}
		});
	}
}
