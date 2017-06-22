'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var Word = require('../app/models/word');
var exampleData = require('./exampleInsertManyData');

chai.use(chaiHttp);

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

function test(expected, actual) {
	actual.should.be.an('array')
		.with.lengthOf(expected.length);
	var sortedExpected = expected.sort(quickCompare);
	var sortedActual = actual.sort(quickCompare);

	for (let i = 0; i < expected.length; i++) {
		let exp = sortedExpected[i];
		let act = sortedExpected[i];

		act.should.have.property('orcish', exp.orcish);
		act.should.have.property('english', exp.english);
		act.should.have.property('PoS', exp.PoS);
		act.should.have.property('num', exp.num);
	}
}

describe('Words.insertManyWithRetry', function() {
	beforeEach(function() {
		return Word.remove({})
		.then(function() {
			return Word.insertMany(exampleData.initialWords());
		});
	});

	it('it should work if 2 words have the same orcish and num',
	function() {
		return Word.insertManyWithRetry(exampleData.insertingWords())
		.then(function(res) {
			res.should.be.an('object');
			res.should.have.property('successes');
			res.successes.should.be.an('array');
			res.successes.should.have.lengthOf(4);
			res.should.have.property('failures');
			res.failures.should.be.an('array');
			res.failures.should.have.lengthOf(0);
			test(exampleData.returnedWords(), res.successes);
			return Word.find({});
		})
		.then(function(words) {
			test(exampleData.finalWords(), words);
		});
	});
});
