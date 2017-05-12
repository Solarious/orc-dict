'use strict';

var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');

module.exports = {
	getMatches: getMatches,
	getSearchIndexes: getSearchIndexes,
	rebuild: rebuild,
	getAll: getAll
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
			var f = found[match.word.orcish];
			if (f && (f.indexOf(match.message) !== -1)) {
				return false;
			} else {
				found[match.word.orcish] = found[match.word.orcish] || [];
				found[match.word.orcish].push(match.message);
				return true;
			}
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

function rebuild(callback) {
	SearchIndex.remove({})
	.then(function() {
		return Word.find({});
	})
	.then(function(words) {
		var searchIndexes = [];
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			searchIndexes.push({
				keyword: word.orcish,
				priority: 1,
				message: 'orcish',
				orcish: word.orcish
			});
			searchIndexes.push({
				keyword: word.english,
				priority: 1,
				message: 'english',
				orcish: word.orcish
			});
			if (word.PoS === 'noun') {
				addNoun(word, searchIndexes);
			} else if (word.PoS === 'verb') {
				addVerb(word, searchIndexes);
			} else if (word.PoS === 'adjective') {
				addAdjective(word, searchIndexes);
			} else if (word.PoS === 'pronoun') {
				addPronoun(word, searchIndexes);
			} else if (word.PoS === 'possessive') {
				addPossessive(word, searchIndexes);
			} else if (word.PoS === 'demonstrative') {
				addDemonstrative(word, searchIndexes);
			} else if (word.PoS === 'relative') {
				addRelative(word, searchIndexes);
			} else if (word.PoS === 'prefix') {
				addPrefix(word, searchIndexes);
			} else if (word.PoS === 'suffix') {
				addSuffix(word, searchIndexes);
			}

			addKeywords(word, searchIndexes);
		}
		return SearchIndex.insertMany(searchIndexes, callback);
	})
	.catch(function(error) {
		console.log(error);
		console.log(error.stack);
		callback(error);
	});
}

function getAll(callback) {
	SearchIndex.find({}, callback);
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
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.noun[nounCase].plural,
		priority: 2,
		message: nounCase + ' plural',
		orcish: word.orcish
	});
}

function addVerb(word, searchIndexes) {
	searchIndexes.push({
		keyword: word.verb.infinitive,
		priority: 2,
		message: 'infinitive',
		orcish: word.orcish
	});
	addVerbVoice(word, searchIndexes, 'active');
	addVerbVoice(word, searchIndexes, 'passive');
	searchIndexes.push({
		keyword: word.verb.imperative.singular,
		priority: 2,
		message: 'inperative singular',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.verb.imperative.plural,
		priority: 2,
		message: 'inperative plural',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.verb.participle.feminine,
		priority: 3,
		message: 'participle feminine',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.verb.participle.masculine,
		priority: 3,
		message: 'participle masculine',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.verb.agent.feminine,
		priority: 3,
		message: 'agent feminine',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.verb.agent.masculine,
		priority: 3,
		message: 'agent masculine',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.verb.agent.dishonorable,
		priority: 3,
		message: 'agent dishonorable',
		orcish: word.orcish
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
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: tense.first.plural,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 1st person plural',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: tense.second.singular,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 2nd person singular',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: tense.second.plural,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 2nd person plural',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: tense.third.singular,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 3rd person singular',
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: tense.third.plural,
		priority: 2,
		message: tenseStr + ' ' + verbVoice + ' 3rd person plural',
		orcish: word.orcish
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
		orcish: word.orcish
	});
	searchIndexes.push({
		keyword: word.adjective[gender][adjectiveCase].plural,
		priority: 2,
		message: gender + ' ' + caseStr + ' plural',
		orcish: word.orcish
	});
}

function addPronoun(word, searchIndexes) {
	addCase(word, searchIndexes, 'pronoun', 'nominative');
	addCase(word, searchIndexes, 'pronoun', 'genitive');
	addCase(word, searchIndexes, 'pronoun', 'dative');
	addCase(word, searchIndexes, 'pronoun', 'accusative');
	addCase(word, searchIndexes, 'pronoun', 'vocative');
}

function addPossessive(word, searchIndexes) {
	addCase(word, searchIndexes, 'possessive', 'nominative');
	addCase(word, searchIndexes, 'possessive', 'genitive');
	addCase(word, searchIndexes, 'possessive', 'dative');
	addCase(word, searchIndexes, 'possessive', 'accusative');
	addCase(word, searchIndexes, 'possessive', 'vocative');
}

function addDemonstrative(word, searchIndexes) {
	addCase(word, searchIndexes, 'demonstrative', 'nominative');
	addCase(word, searchIndexes, 'demonstrative', 'genitive');
	addCase(word, searchIndexes, 'demonstrative', 'dative');
	addCase(word, searchIndexes, 'demonstrative', 'accusative');
	addCase(word, searchIndexes, 'demonstrative', 'vocative');
}

function addCase(word, searchIndexes, PoS, caseName) {
	searchIndexes.push({
		keyword: word[PoS][caseName],
		priority: 2,
		message: caseName,
		orcish: word.orcish
	});
}

function addRelative(word, searchIndexes) {
	addRelativeGender(word, searchIndexes, 'masculine');
	addRelativeGender(word, searchIndexes, 'feminine');
	addRelativeGender(word, searchIndexes, 'neutral');
}

function addRelativeGender(word, searchIndexes, gender) {
	addRelativeCase(word, searchIndexes, gender, 'nominative');
	addRelativeCase(word, searchIndexes, gender, 'genitive');
	addRelativeCase(word, searchIndexes, gender, 'dative');
	addRelativeCase(word, searchIndexes, gender, 'accusative');
	addRelativeCase(word, searchIndexes, gender, 'vocative');
}

function addRelativeCase(word, searchIndexes, gender, relativeCase) {
	searchIndexes.push({
		keyword: word.relative[gender][relativeCase],
		priority: 2,
		message: relativeCase,
		orcish: word.orcish
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
		orcish: word.orcish,
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
		orcish: word.orcish,
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
			orcish: word.orcish
		});
	}
}
