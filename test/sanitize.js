'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');

chai.use(chaiHttp);

describe('Sanitize', function() {
	describe('query', function() {
		it('it should reject keys starting with a $', function() {
			return chai.request(server)
			.get('/api/words/?$skip=all')
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Query $skip=all rejected by sanitizer: key must not' +
					' start with a "$"'
				);
			});
		});

		it('it should reject values starting with a $', function() {
			return chai.request(server)
			.get('/api/words/?skip=$all')
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Query skip=$all rejected by sanitizer: value must not' +
					' start with a "$"'
				);
			});
		});

		it('it should reject values that are arrays', function() {
			return chai.request(server)
			.get('/api/words/?skip=all&skip=none')
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Query skip=["all","none"] rejected by sanitizer:' +
					' value must be a number or a string'
				);
			});
		});

		it('it should reject values that are objects', function() {
			return chai.request(server)
			.get('/api/words/?skip[a]=all&skip[b]=none')
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Query skip={"a":"all","b":"none"} rejected by' +
					' sanitizer: value must be a number or a string'
				);
			});
		});
	});

	describe('body', function() {
		it('it should reject keys starting with a $', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({$thing: 6})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: key $thing must not' +
					' start with a "$"'
				);
			});
		});

		it('it should reject values starting with a $', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({thing: '$s'})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: value for key thing must' +
					' not start with a "$"'
				);
			});
		});

		it('it should reject values containing a <', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({thing: 'one < s'})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: value for key thing must' +
					' not contain a "<"'
				);
			});
		});

		it('it should reject values containing a >', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({thing: 'one > s'})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: value for key thing must' +
					' not contain a ">"'
				);
			});
		});

		it('it should reject deep keys starting with a $', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({thing: {$bad: 6}})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: key $bad must not' +
					' start with a "$"'
				);
			});
		});

		it('it should reject deep values starting with a $', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({thing: {bad: "$y"}})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: value for key bad must' +
					' not start with a "$"'
				);
			});
		});

		it('it should reject deep values containing a <', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({thing: {bad: "<y"}})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: value for key bad must' +
					' not contain a "<"'
				);
			});
		});

		it('it should reject deep values containing a >', function() {
			return chai.request(server)
			.post('/api/words/')
			.send({thing: {bad: ">y"}})
			.then(function(res) {
				res.should.have.status(400);
			}, function(err) {
				err.response.should.have.status(400);
				err.response.text.should.be.a('string');
				err.response.text.should.eql(
					'Body rejected by sanitizer: value for key bad must' +
					' not contain a ">"'
				);
			});
		});
	});
});
