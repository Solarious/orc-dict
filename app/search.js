'use strict';

var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');

module.exports = {
	getMatches: getMatches,
	getSearchIndexes: getSearchIndexes,
	getPrefixMatches: getPrefixMatches,
	getSuffixMatches: getSuffixMatches,
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
		promises.push(getSearchIndexes(searches[i]));
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

function getSearchIndexes(searchString) {
	return Promise.all([
		SearchIndex.getMatches(searchString),
		getPrefixMatches(searchString),
		getSuffixMatches(searchString)
	])
	.then(function(data) {
		return data[0].concat(data[1], data[2]);
	});
}

function getPrefixMatches(str) {
	var prefixWords;
	var affixlessStrs;
	return SearchIndex.getMatchesWithAffix('prefix')
	.then(function(results) {
		prefixWords = results.filter(function(prefixWord) {
			return str.startsWith(prefixWord.word.orcish.replace(/\W/g, ''));
		});
		var promises = prefixWords.map(function(prefixWord) {
			var prefix = prefixWord.word.orcish.replace(/\W/g, '');
			var affixless = str.slice(prefix.length);
			return SearchIndex.getMatches(affixless);
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
			let prefixWord = prefixWords[i];
			let matchesForPrefix = matches[i];
			if (prefixWord.affixLimits.length > 0) {
				matchesForPrefix = matchesForPrefix.filter(
					filterFun(prefixWord.affixLimits)
				);
			}
			if (matchesForPrefix.length > 0) {
				results.push(prefixWord);
				for (let j = 0; j < matchesForPrefix.length; j++) {
					let match = matchesForPrefix[j];
					let start = '(with prefix ' + prefixWord.keyword + ') ';
					match.message = start + match.message;
					match.priority += prefixWord.priority;
					results.push(match);
				}
			}
		}
		return results;
	});
}

function getSuffixMatches(str) {
	var suffixWords;
	var affixlessStrs;
	return SearchIndex.getMatchesWithAffix('suffix')
	.then(function(results) {
		suffixWords = results.filter(function(suffixWord) {
			return str.endsWith(suffixWord.word.orcish.replace(/\W/g, ''));
		});
		var promises = suffixWords.map(function(suffixWord) {
			var suffix = suffixWord.word.orcish.replace(/\W/g, '');
			var affixless = str.slice(0, -suffix.length);
			return SearchIndex.getMatches(affixless);
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
			let suffixWord = suffixWords[i];
			let matchesForSuffix = matches[i];
			if (suffixWord.affixLimits.length > 0) {
				matchesForSuffix = matchesForSuffix.filter(
					filterFun(suffixWord.affixLimits)
				);
			}
			if (matchesForSuffix.length > 0) {
				results.push(suffixWord);
				for (let j = 0; j < matchesForSuffix.length; j++) {
					let match = matchesForSuffix[j];
					let start = '(with suffix ' + suffixWord.keyword + ') ';
					match.message = start + match.message;
					match.priority += suffixWord.priority;
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
