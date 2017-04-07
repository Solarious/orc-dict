var path = require('path');
var passport = require('passport');
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

app.get('/api/autofillword/:PoS/:orcish', function(req, res) {
	var PoS = req.params.PoS;
	var orcish = req.params.orcish;
	autofill(orcish, PoS, function(err, wordPart) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json(wordPart);
		}
	});
});

app.post('/api/user/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return status(500).json({
					err: err
				});
			}
			res.status(200).json({
				status: 'Login successful'
			});
		});
	})(req, res, next);
});

app.get('/api/user/logout', function(req, res) {
	req.logout();
	res.json({
		status: 'Logout success'
	});
});

app.get('/api/user/status', function(req, res) {
	if (req.isAuthenticated()) {
		return res.status(200).json({
			status: true,
			username: req.user.username
		});
	} else {
		return res.status(200).json({
			status: false
		});
	}
});

app.get('*', function(req, res) {
	res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

};// module.exports
