var mongoose = require('mongoose');
var Sentence = require('../app/models/sentence');
var search = require('../app/search');

var dburl = process.env.MONGODB_URI;

mongoose.connect(dburl);

var sentences;

Sentence.find({})
//.limit(20)
.exec()
.then(function(data) {
	sentences = data;
	return Promise.all(sentences.map(function(sentence) {
		return search.getMatches(sentence.orcish);
	}));
})
.then(function(results) {
	return results.map(function(result, i) {
		return {
			category: sentences[i].category,
			english: sentences[i].english,
			orcish: sentences[i].orcish,
			matches: result.map(function(data) {
				return {
					str: data.str,
					numMatches: data.matches.length
				}
			})
		}
	});
})
.then(function(data) {
	return data.filter(function(r) {
		for (let i = 0; i < r.matches.length; i++) {
			if (r.matches[i].numMatches == 0) return true;
		}
		return false;
	});
})
.then(function(data) {
	console.log('----------data-------------');
	data.forEach(d => {
		console.log(d.category);
		console.log(d.english);
		console.log(d.orcish);
		d.matches.forEach(m => {
			if (m.numMatches == 0) {
				console.log('\t' + m.str + ': ' + m.numMatches);
			}
		});
		console.log();
	});
	process.exit();
})
.catch(function(error) {
	console.log(error);
	process.exit();
});
