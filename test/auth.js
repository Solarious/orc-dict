'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var User = require('../app/models/user');

chai.use(chaiHttp);

var routesLogin = [];
var routesTokenOnly = [];

function addRouteLogin(method, path, examplePath) {
	if (!examplePath) {
		examplePath = path;
	}
	routesLogin.push({
		method: method,
		path: path,
		examplePath: examplePath
	});
}

function addRouteTokenOnly(method, path, examplePath) {
	if (!examplePath) {
		examplePath = path;
	}
	routesTokenOnly.push({
		method: method,
		path: path,
		examplePath: examplePath
	});
}

addRouteLogin('POST', '/api/bulkadd');
addRouteLogin('POST', '/api/search/rebuild');
addRouteLogin('POST', '/api/sentences');
addRouteLogin('PUT', '/api/sentences/:id', '/api/sentences/12301');
addRouteLogin('DELETE', '/api/sentences/:id', '/api/sentences/12301');
addRouteTokenOnly('POST', '/api/user/login');
addRouteTokenOnly('POST', '/api/user/logout');
addRouteTokenOnly('POST', '/api/user/forgot');
addRouteTokenOnly('POST', '/api/user/reset');
addRouteLogin('POST', '/api/words');
addRouteLogin('PUT', '/api/words/:orcish/:num', '/api/words/ka/1');
addRouteLogin('DELETE', '/api/words/:orcish/:num', '/api/words/ka/1');
addRouteLogin('DELETE', '/api/words-by-pos/:pos', '/api/words-by-pos/noun');

describe('authentication', function() {
	var wordObj = {
		orcish: 'nul',
		english: 'one',
		PoS: 'cardinal'
	};

	describe('without XSRF-TOKEN', function() {
		routesLogin.concat(routesTokenOnly).forEach(function(route) {
			it(route.method + ' ' + route.path + ' should send a 403',
			function() {
				return chai.request(server)
				[route.method.toLowerCase()](route.examplePath)
				.then(function(res) {
					res.should.have.status(403);
					res.text.should.be.a('string');
					res.text.should.eql('Invalid/Missing csrf token');
				});
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
				return User.deleteMany({});
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

		it('it should send a 401 on incorrect username', function() {
			agent
			.post('/api/user/login')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				username: 'noauser',
				password: 'noauserspassword'
			})
			.then(function(res) {
				res.should.have.status(401);
			});
		});

		it('it should login with correct credentials', function() {
			agent
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
			.then(function(res) {
				res.should.have.status(401);
				res.text.should.be.a('string');
				res.text.should.eql('Unauthorized');
			});
		});

		routesLogin.forEach(function(route) {
			it(route.method + ' ' + route.path + ' should send a 401',
			function() {
				return agent
				[route.method.toLowerCase()](route.examplePath)
				.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
				.then(function(res) {
					res.should.have.status(401);
				}, function(err) {
					err.response.should.have.status(401);
					err.response.text.should.be.a('string');
					err.response.text.should.eql('Unauthorized');
				});
			});
		});
	});
});
