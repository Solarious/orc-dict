'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var Word = require('../app/models/word');

chai.use(chaiHttp);

describe('Words', function() {
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
			console.log(res.body.words);
			done();
		});
	});
});
