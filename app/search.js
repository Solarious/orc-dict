'use strict';

var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');

module.exports = {
	getMatches: getMatches,
	getTextMatches: getTextMatches,
	getSearchIndexes: getSearchIndexes,
	getAll: getAll,
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

function getTextMatches(text) {
	return Word.find({
		$text: {
			$search: text
		}
	}, {
		orcish: 1,
		english: 1,
		PoS: 1,
		num: 1,
		score: {
			$meta: 'textScore'
		}
	})
	.sort({
		score: {
			$meta: 'textScore'
		}
	})
	.exec();
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

function getAll(callback) {
	SearchIndex.find({}, callback);
}

