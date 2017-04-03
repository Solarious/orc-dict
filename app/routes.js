var path = require('path');
var Word = require('./models/word');
var autofill = require('./autofill');

function updateWordFromReq(word, req) {
	word.orcish = req.body['orcish'];
	word.english = req.body['english'];
	word.PoS = req.body['PoS'];
	if (req.body['verb']) {
		word.verb = req.body['verb'];
	}
}

module.exports = function(app) {

app.get('/api/words', function(req, res) {
	Word.find({}, 'orcish english PoS', function(err, words) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.setHeader('Cache-Control', 'no-cache');
			res.json(words);
		}
	});
});

app.post('/api/words', function(req, res) {
	var newWord = new Word();
	updateWordFromReq(newWord, req);
	newWord.save(function(err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json(newWord);
		}
	});
});

app.get('/api/words/:word_orcish', function(req, res) {
	Word.findOne({
		'orcish': req.params.word_orcish
	}, function(err, word) {
		if (err) {
			console.log('did not find: ' + req.params.word_orcish);
			res.status(500).send(err);
		} else {
			if (!word) {
				res.status(404).send({
					error: 'cannot find word: ' + req.params.word_orcish
				});
			} else {
				res.setHeader('Cache-Control', 'no-cache');
				res.json(word);
			}
		}
	});
});

app.put('/api/words/:word_orcish', function(req, res) {
	Word.findOne({
		'orcish': req.params.word_orcish
	}, function(err, word) {
		if (err) {
			res.status(500).send(err);
		} else {
			updateWordFromReq(word, req);
			word.save(function(err) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.json(word);
				}
			});
		}
	});
});

app.delete('/api/words/:word_orcish', function(req, res) {
	Word.findOneAndRemove({
		'orcish': req.params.word_orcish
	}, function (err, word) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json(word);
		}
	});
});

app.post('/api/autofillword', function(req, res) {
	var word = new Word();
	orcish = req.body['orcish'];
	english = req.body['english'];
	PoS = req.body['PoS'];
	autofill(orcish, english, PoS, function(err, word) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json(word);
		}
	});
});

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

};// module.exports
