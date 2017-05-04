'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var User = require('../app/models/user');

chai.use(chaiHttp);

describe('authentication', function() {
	var wordObj = {
		orcish: 'nul',
		english: 'one',
		PoS: 'cardinal'
	};

	describe('without XSRF-TOKEN', function() {

		it('POST /api/words should send a 403', function(done) {
			chai.request(server)
			.post('/api/words')
			.send(wordObj)
			.end(function(error, res) {
				res.should.have.status(403);
				res.text.should.be.a('string');
				res.text.should.eql('Invalid/Missing csrf token');
				done();
			});
		});

		it('PUT /api/words/:orcish should send a 403', function(done) {
			chai.request(server)
			.put('/api/words/ka')
			.send(wordObj)
			.end(function(error, res) {
				res.should.have.status(403);
				res.text.should.be.a('string');
				res.text.should.eql('Invalid/Missing csrf token');
				done();
			});
		});

		it('DELETE /api/words/:orcish should send a 403', function(done) {
			chai.request(server)
			.delete('/api/words/ka')
			.end(function(error, res) {
				res.should.have.status(403);
				res.text.should.be.a('string');
				res.text.should.eql('Invalid/Missing csrf token');
				done();
			});
		});

		it('POST /api/user/login should send a 403', function(done) {
			chai.request(server)
			.post('/api/user/login')
			.end(function(error, res) {
				res.should.have.status(403);
				res.text.should.be.a('string');
				res.text.should.eql('Invalid/Missing csrf token');
				done();
			});
		});

		it('POST /api/user/reset should send a 403', function(done) {
			chai.request(server)
			.post('/api/user/reset')
			.end(function(error, res) {
				res.should.have.status(403);
				res.text.should.be.a('string');
				res.text.should.eql('Invalid/Missing csrf token');
				done();
			});
		});

		it('POST /api/bulkadd should send a 403', function(done) {
			chai.request(server)
			.post('/api/bulkadd')
			.end(function(error, res) {
				res.should.have.status(403);
				res.text.should.be.a('string');
				res.text.should.eql('Invalid/Missing csrf token');
				done();
			});
		});
	});

	describe('with XSRF-TOKEN but without first logging in', function() {
		var cookiesText;
		var agent;
		var cookies;

		beforeEach(function() {
			agent = chai.request.agent(server);
			return agent
			.get('/api/words')
			.then(function(res) {
				cookiesText = res.headers['set-cookie'];
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
			});
		});

		it('it should have cookies set', function() {
			cookiesText.should.be.an('array');
			cookies['XSRF-TOKEN'].should.be.a('string');
		});

		it('it should send a 401 on incorrect username', function(done) {
			agent
			.post('/api/user/login')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				username: 'noauser',
				password: 'noauserspassword'
			})
			.end(function(error, res) {
				res.should.have.status(401);
				done();
			});
		});

		it('it should login with correct credentials', function(done) {
			agent
			.post('/api/user/login')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				username: 'test',
				password: 'testpassword'
			})
			.end(function(error, res) {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.eql({
					status: 'Login successful'
				});
				done();
			});
		});

		it('it should log out correctly', function() {
			return agent
			.post('/api/user/login')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				username: 'test',
				password: 'testpassword'
			})
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.eql({
					status: 'Login successful'
				});
				return agent
				.post('/api/user/logout')
				.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN']);
			})
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.eql({
					status: 'Logout success'
				});
				return agent
				.post('/api/words')
				.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
				.send(wordObj);
			})
			.catch(function(error) {
				error.response.should.have.status(401);
				error.response.text.should.be.a('string');
				error.response.text.should.eql('Unauthorized');
			});
		});

		it('POST /api/words should send a 401', function(done) {
			agent
			.post('/api/words')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send(wordObj)
			.end(function(error, res) {
				res.should.have.status(401);
				res.text.should.be.a('string');
				res.text.should.eql('Unauthorized');
				done();
			});
		});

		it('PUT /api/words/:orcish should send a 401', function(done) {
			agent
			.put('/api/words/ka')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send(wordObj)
			.end(function(error, res) {
				res.should.have.status(401);
				res.text.should.be.a('string');
				res.text.should.eql('Unauthorized');
				done();
			});
		});

		it('DELETE /api/words/:orcish should send a 401', function(done) {
			agent
			.delete('/api/words/ka')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.end(function(error, res) {
				res.should.have.status(401);
				res.text.should.be.a('string');
				res.text.should.eql('Unauthorized');
				done();
			});
		});

		it('POST /api/bulkadd should send a 401', function(done) {
			agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.end(function(error, res) {
				res.should.have.status(401);
				res.text.should.be.a('string');
				res.text.should.eql('Unauthorized');
				done();
			});
		});
	});

});
