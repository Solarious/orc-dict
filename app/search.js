'use strict';

var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');

module.exports = {
	getMatches: getMatches,
	getTextMatches: getTextMatches
};

function getMatches(text) {
	var regex = /[^\s"]+|"([^"]*)"/g;
	var match;
	var searches = [];
	while ((match = regex.exec(text.toLowerCase()))) {
		var s = match[1] ? match[1] : match[0];
		s = s.replace(/^[.,?!]/, '');
		s = s.replace(/[.,?!]$/, '');
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
	return Promise.all([
		getNormalTextMatches(text),
		getOtherTextMatches(text)
	])
	.then(function(results) {
		var data = results[0];
		var usedIds = {};
		data.forEach(function(word) {
			usedIds[word._id] = true;
		});
		results[1].forEach(function(word) {
			if (!usedIds[word._id]) {
				usedIds[word._id] = true;
				data.push(word);
			}
		});
		return data;
	});
}

function getNormalTextMatches(text) {
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

function getOtherTextMatches(text) {
	return Word.find({
		$text: {
			$search: text,
			$language: 'none'
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
				match.keyword += ' (with ' + afs.join(', ') + ')';
				delete match.withAffixes;
			}
		});
		var found = {};
		var filteredMatches = matches.filter(function(match) {
			var f = found[match.word.orcish] || [];
			for (let i = 0; i < f.length; i++) {
				let fi = f[i];
				if (fi.num === match.word.num &&
				fi.message === match.message &&
				fi.keyword === match.keyword) {
					return false;
				}
			}
			found[match.word.orcish] = f;
			found[match.word.orcish].push({
				message: match.message,
				num: match.word.num,
				keyword: match.keyword
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
	var affixInfo = [];
	return SearchIndex.getMatchesWithAffix('all')
	.then(function(results) {
		results.forEach(function(affixSI) {
			if (affixSI.affix === 'prefix') {
				if (str.startsWith(affixSI.keyword)) {
					affixInfo.push({
						searchIndex: affixSI,
						searchStr: str.slice(affixSI.keyword.length),
					});
				}
				handleVerbs(str, affixSI, affixInfo);
			} else {
				if (str.endsWith(affixSI.keyword)) {
					affixInfo.push({
						searchIndex: affixSI,
						searchStr: str.slice(0, -affixSI.keyword.length)
					});
				}
			}
		});
		return Promise.all(affixInfo.map(function(info) {
			return getSearchIndexes(info.searchStr);
		}));
	})
	.then(function(matches) {
		var results = [];
		function filterFun(limits) {
			return function(match) {
				return (limits.indexOf(match.word.PoS) !== -1);
			};
		}
		function getFilterVerbFun(affixInfoI) {
			return function(match) {
				return filterVerb(match, affixInfoI);
			};
		}
		for (let i = 0; i < matches.length; i++) {
			let affixSI = affixInfo[i].searchIndex;
			let matchesForAffix = matches[i];
			if (affixSI.affixLimits.length > 0) {
				matchesForAffix = matchesForAffix.filter(
					filterFun(affixSI.affixLimits)
				);
			}
			if (affixInfo[i].conj) {
				matchesForAffix = matchesForAffix.filter(
					getFilterVerbFun(affixInfo[i])
				);
			}
			for (let j = 0; j < matchesForAffix.length; j++) {
				let match = matchesForAffix[j];
				match.withAffixes = match.withAffixes || [];
				match.withAffixes.push(affixSI);
				results.push(match);
			}
		}
		return results;
	});
}

function handleVerbs(str, affixSI, affixInfo) {
	var tenses = ['ash', 'ar', 'hush', 'hur', 'zsa', 'zsur', 'huzs', 'azsur'];
	for (let i = 0; i < tenses.length; i++) {
		let tense = tenses[i];
		let searchStr = str.slice(0, tense.length) +
			str.slice(tense.length + affixSI.keyword.length);
		if (str.startsWith(tense + affixSI.keyword)) {
			affixInfo.push({
				searchIndex: affixSI,
				searchStr: searchStr,
				conj: (i < 4) ? 'first' : 'second',
				tenseLen: tense.length
			});
		}
	}
}

function filterVerb(match, affixInfoI) {
	return match.word.PoS === 'verb' &&
	match.keyword.slice(affixInfoI.tenseLen).startsWith(match.word.orcish);
}
