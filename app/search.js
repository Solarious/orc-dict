var SearchIndex = require('./models/searchIndex');
var Word = require('./models/word');

module.exports = {
	getMatches: getMatches,
	rebuild: rebuild,
	getAll: getAll
};

function getMatches(str, callback) {
	var regex = /[^\s"]+|"([^"]*)"/g;
	var match;
	var searches = [];
	while (match = regex.exec(str.toLowerCase())) {
		if (match[1]) {
			var s = match[1];
		} else {
			var s = match[0];
		}
		searches.push(s);
	}

	var promises = [];
	for (var i = 0; i < searches.length; i++) {
		promises.push(SearchIndex.getMatches(searches[i]));
	}
	Promise.all(promises)
	.then(function(data) {
		var results = [];
		for (var i = 0; i < searches.length; i++) {
			results.push({
				str: searches[i],
				matches: data[i]
			});
		}
		callback(null, results);
	})
	.catch(function(error) {
		callback(error);
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
				priority: 2,
				message: 'orcish',
				orcish: word.orcish
			});
			if (word.PoS === 'noun') {
				addNoun(word, searchIndexes);
			} else if (word.PoS === 'verb') {
				addVerb(word, searchIndexes);
			} else if (word.PoS === 'adjective') {
				addAdjective(word, searchIndexes);
			}
		}
		return SearchIndex.insertMany(searchIndexes, callback);
	})
	.catch(function(error) {
		console.log(error);
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
	tenseStr = verbTense.replace(/([A-Z])/g, ' $1').toLowerCase();
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
