'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var Word = require('../app/models/word');
var User = require('../app/models/user');

chai.use(chaiHttp);

describe('Words', function() {
	function confirmWord(res, orcish, english, PoS, num) {
		res.should.have.status(200);
		res.body.should.be.an('object');
		res.body.should.have.property('orcish', orcish);
		res.body.should.have.property('english', english);
		res.body.should.have.property('PoS', PoS);
		res.body.should.have.property('num', num);
		res.body.relatedWords.should.eql([]);
		res.body.exampleSentences.should.eql([]);
		res.body.keywords.should.eql([]);
		res.body.should.not.have.property('extraInfo');
		res.body.should.not.have.property('coinedBy');
		res.body.should.not.have.property('namedAfter');
		res.body.should.not.have.property('verb');
		res.body.should.not.have.property('noun');
		res.body.should.not.have.property('adjective');
		res.body.should.not.have.property('pronoun');
		res.body.should.not.have.property('possessive');
		res.body.should.not.have.property('demonstrative');
		res.body.should.not.have.property('relative');
		res.body.should.not.have.property('affix');
	}

	beforeEach(function() {
		return Word.remove({})
		.then(function() {
			return Word.insertMany([
				{
					orcish: 'nul',
					english: 'one',
					PoS: 'cardinal'
				},
				{
					orcish: 'solu',
					english: 'two',
					PoS: 'cardinal'
				},
				{
					orcish: 'solu',
					english: 'two',
					PoS: 'cardinal'
				},
				{
					orcish: 'thaen',
					english: 'three',
					PoS: 'cardinal'
				},
				{
					orcish: 'enyet',
					english: 'still',
					PoS: 'adverb'
				},
				{
					orcish: 'gadz',
					english: 'not',
					PoS: 'adverb'
				},
				{
					orcish: 'ek',
					english: 'and',
					PoS: 'conjunction'
				},
				{
					orcish: 'quiz',
					english: 'while',
					PoS: 'conjunction'
				},
			]);
		});
	});

	describe('Without needing to login', function() {
		it('it should GET all the words', function() {
			return chai.request(server)
			.get('/api/words')
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.have.property('words');
				res.body.words.should.be.an('array');
				res.body.words.length.should.eql(8);
			});
		});

		it('it should GET a word', function() {
			return chai.request(server)
			.get('/api/words/solu/1')
			.then(function(res) {
				confirmWord(res, 'solu', 'two', 'cardinal', 1);
			});
		});

		it('it should not GET a word that does not exist', function() {
			return chai.request(server)
			.get('/api/words/notaword/1')
			.then(function(res) {
				res.should.have.status(404);
			}, function(error) {
				error.response.should.have.status(404);
				error.response.text.should.be.a('string');
				error.response.text.should.eql('cannot find word: notaword 1');
			});
		});

		it('it should not GET a word with using an incorrect num', function() {
			return chai.request(server)
			.get('/api/words/nul/2')
			.then(function(res) {
				res.should.have.status(404);
			}, function(error) {
				error.response.should.have.status(404);
				error.response.text.should.be.a('string');
				error.response.text.should.eql('cannot find word: nul 2');
			});
		});
	});

	describe('After logging in', function() {
		var agent;
		var cookies;

		beforeEach(function() {
			agent = chai.request.agent(server);
			return agent
			.get('/api/words')
			.then(function(res) {
				var cookiesText = res.headers['set-cookie'];
				cookies = {};
				for (let i = 0; i < cookiesText.length; i++) {
					let cookieText = cookiesText[i];
					let c = cookieText.split(';')[0].split('=');
					let cname = c[0];
					let cvalue = c[1];
					cookies[cname] = cvalue;
				}
				return User.remove({});
			})
			.then(function() {
				var user = new User({
					username: 'test',
					email: 'test@testing.com',
					password: 'testpassword'
				});
				return user.save();
			})
			.then(function() {
				return agent
				.post('/api/user/login')
				.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
				.send({
					username: 'test',
					password: 'testpassword'
				});
			});
		});

		it('it should POST a word', function() {
			return agent
			.post('/api/words')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				orcish: 'gudz',
				english: 'zero',
				PoS: 'cardinal'
			})
			.then(function(res) {
				confirmWord(res, 'gudz', 'zero', 'cardinal', 1);
				return agent
				.get('/api/words/gudz/1');
			})
			.then(function(res) {
				confirmWord(res, 'gudz', 'zero', 'cardinal', 1);
			});
		});

		it('it should POST an already inserted word', function() {
			return agent
			.post('/api/words')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				orcish: 'thaen',
				english: 'three',
				PoS: 'cardinal'
			})
			.then(function(res) {
				confirmWord(res, 'thaen', 'three', 'cardinal', 2);
				return agent
				.get('/api/words/thaen/2');
			})
			.then(function(res) {
				confirmWord(res, 'thaen', 'three', 'cardinal', 2);
			});
		});

		it('it should convert orcish to lower case', function() {
			return agent
			.post('/api/words')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				orcish: 'Roi',
				english: 'eight',
				PoS: 'cardinal'
			})
			.then(function(res) {
				confirmWord(res, 'roi', 'eight', 'cardinal', 1);
				return agent
				.get('/api/words/roi/1');
			})
			.then(function(res) {
				confirmWord(res, 'roi', 'eight', 'cardinal', 1);
			});
		});

		it('it should update(PUT) a word', function() {
			return agent
			.put('/api/words/thaen/1')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				orcish: 'roi',
				english: 'eight',
				PoS: 'cardinal'
			})
			.then(function(res) {
				confirmWord(res, 'roi', 'eight', 'cardinal', 1);
				return agent
				.get('/api/words/roi/1');
			})
			.then(function(res) {
				confirmWord(res, 'roi', 'eight', 'cardinal', 1);
			});
		});

		it('it should update(PUT) a word to one that exists', function() {
			return agent
			.put('/api/words/nul/1')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				orcish: 'thaen',
				english: 'three',
				PoS: 'cardinal'
			})
			.then(function(res) {
				confirmWord(res, 'thaen', 'three', 'cardinal', 2);
				return agent
				.get('/api/words/thaen/2');
			})
			.then(function(res) {
				confirmWord(res, 'thaen', 'three', 'cardinal', 2);
			});
		});

		it('it should not DELETE words by PoS with an invalid PoS', function() {
			return agent
			.delete('/api/words-by-pos/nul')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.then(function(res) {
				res.should.have.status(400);
			}, function(error) {
				error.response.should.have.status(400);
				error.response.text.should.be.a('string');
				error.response.text.should.eql('Invalid PoS nul');
			});
		});

		it('it should DELETE words by PoS', function() {
			return agent
			.delete('/api/words-by-pos/cardinal')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.have.property('n', 4);
				return agent
				.get('/api/words');
			})
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.have.property('words');
				res.body.words.should.be.an('array');
				res.body.words.length.should.eql(4);
				res.body.words.forEach(function(word) {
					word.should.not.have.property('PoS', 'cardinal');
				});
			});
		});
	});
});
