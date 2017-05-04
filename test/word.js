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
	function confirmWord(res, orcish, english, PoS) {
		res.should.have.status(200);
		res.body.should.be.an('object');
		res.body.should.have.property('orcish', orcish);
		res.body.should.have.property('english', english);
		res.body.should.have.property('PoS', PoS);
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
					orcish: 'thaen',
					english: 'three',
					PoS: 'cardinal'
				},
			]);
		});
	});

	it('it should GET all the words', function(done) {
		chai.request(server)
		.get('/api/words')
		.end(function(error, res) {
			res.should.have.status(200);
			res.body.should.be.an('object');
			res.body.words.should.be.an('array');
			res.body.words.length.should.eql(3);
			done();
		});
	});

	it('it should GET a word', function() {
		return chai.request(server)
		.get('/api/words/solu')
		.then(function(res) {
			confirmWord(res, 'solu', 'two', 'cardinal');
		});
	});

	it('it should not GET a word that does not exist', function() {
		return chai.request(server)
		.get('/api/words/notaword')
		.catch(function(error) {
			error.response.should.have.status(404);
			error.response.text.should.be.a('string');
			error.response.text.should.eql('cannot find word: notaword');
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
				confirmWord(res, 'gudz', 'zero', 'cardinal');
				return agent
				.get('/api/words/gudz');
			})
			.then(function(res) {
				confirmWord(res, 'gudz', 'zero', 'cardinal');
			});
		});
	});
});
