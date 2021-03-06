'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var Word = require('../app/models/word');
var User = require('../app/models/user');
var exampleData = require('./exampleBulkAddData');

chai.use(chaiHttp);

function arrayCompare(expected, actual) {
	actual.should.be.an('array');
	actual.length.should.eql(expected.length);
	for (let i = 0; i < expected.length; i++) {
		for (let key in expected[i]) {
			actual[i].should.have.property(key, expected[i][key]);
		}
	}
}

function arraySortThenCompare(expected, actual) {
	expected.should.be.an('array');
	arrayCompare(expected.sort(quickCompare), actual.sort(quickCompare));
}

function quickCompare(a, b) {
	if (a.orcish < b.orcish) {
		return -1;
	}
	if (a.orcish > b.orcish) {
		return 1;
	}
	if (a.num < b.num) {
		return -1;
	}
	if (a.num > b.num) {
		return 1;
	}
	return 0;
}

describe('Bulk Add', function() {
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
			return User.deleteMany({});
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
		})
		.then(function() {
			return Word.deleteMany({});
		});
	});

	function test(data, words, encoding, order, updateMethod) {
		var str = 'it should work with ' + encoding + ', ' + order;
		str += ' and ' + updateMethod;
		it(str, function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: data,
				encoding: encoding,
				updateMethod: updateMethod,
				order: order
			})
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.have.property('successes');
				res.body.should.have.property('failures');
				res.body.failures.should.be.an('array');
				res.body.failures.should.have.lengthOf(0);
				arraySortThenCompare(words, res.body.successes);
			});
		});
	}

	function superTest(words, updateMethod) {
		test(
			exampleData.cardinalDataCsvEop(),
			words,
			'csv', 'e-o-p', updateMethod
		);
		test(
			exampleData.cardinalDataTsvEop(),
			words,
			'tsv', 'e-o-p', updateMethod
		);
		test(
			exampleData.cardinalDataCsvOpe(),
			words,
			'csv', 'o-p-e', updateMethod
		);
		test(
			exampleData.cardinalDataTsvOpe(),
			words,
			'tsv', 'o-p-e', updateMethod
		);
	}

	describe('with words initially empty', function() {
		superTest(exampleData.cardinalWords(), 'remove');
		superTest(exampleData.cardinalWords(), 'duplicate');
		superTest(exampleData.cardinalWords(), 'unique');
	});

	describe('with some words already added', function() {
		beforeEach(function() {
			return Word.deleteMany({})
			.then(function() {
				var word = new Word({
					orcish: 'nul',
					english: 'one',
					PoS: 'cardinal'
				});
				return word.save();
			});
		});

		superTest(exampleData.cardinalWords(), 'remove');
		superTest(exampleData.cardinalWordsDuplicate(), 'duplicate');
		superTest(exampleData.cardinalWordsUnique(), 'unique');

		it('should not cause any changes if a word is invalid', function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: exampleData.errorDataCsvEop(),
				encoding: 'csv',
				updateMethod: 'remove',
				order: 'e-o-p'
			})
			.then(function(res) {
				res.should.have.status(404);
				return agent
				.get('/api/words');
			})
			.then(function(res) {
				res.should.have.status(200);
				arrayCompare(exampleData.cardinalWordsError(), res.body.words);
			});
		});
	});

	describe('when using invalid parameters', function() {
		function testError(encoding, updateMethod, order, errorText) {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: exampleData.cardinalWords(),
				encoding: encoding,
				updateMethod: updateMethod,
				order: order
			})
			.then(function(res) {
				res.should.have.status(404);
				res.text.should.be.a('string');
				res.text.should.eql(errorText);
			});
		}

		it('it should return an error when encoding is invalid', function() {
			return testError('crt', 'remove', 'e-o-p',
			'encoding has invalid value crt');
		});

		it('it should return an error when updateMethod is invalid',
		function() {
			return testError('csv', 'delete', 'e-o-p',
			'method has invalid value delete');
		});

		it('it should return an error when order is invalid',
		function() {
			return testError('csv', 'delete', 'p-o-e',
			'order has invalid value p-o-e');
		});
	});

	describe('regarding data correctness', function() {
		it('it should return an error if a record has less than 3 values',
		function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: exampleData.lessthan3DataCsvEop(),
				encoding: 'csv',
				updateMethod: 'duplicate',
				order: 'e-o-p'
			})
			.then(function(res) {
				res.should.have.status(404);
				res.text.should.be.a('string');
				res.text.should.eql(
					'Record me,nudz has less than 3 values'
				);
			});
		});

		it('it should handle empty lines correctly', function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: exampleData.emptyLinesDataCsvEop(),
				encoding: 'csv',
				updateMethod: 'duplicate',
				order: 'e-o-p'
			})
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.have.property('successes');
				res.body.should.have.property('failures');
				res.body.failures.should.be.an('array');
				res.body.failures.should.have.lengthOf(0);
				arraySortThenCompare(
					exampleData.cardinalWords(), res.body.successes
				);
			});
		});
	});
});
