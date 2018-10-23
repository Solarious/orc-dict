'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var indexes = require('../app/indexes');
var Word = require('../app/models/word');
var User = require('../app/models/user');
var SearchIndex = require('../app/models/searchIndex');
var bulkAddData = require('./exampleBulkAddData');
var searchData = require('./exampleSearchIndexData');

chai.use(chaiHttp);

function test(expected, actual) {
	actual.should.be.an('array')
		.with.lengthOf(expected.length);
	var sortedExpected = expected.sort(compare);
	var sortedActual = actual.sort(compare);

	for (let i = 0; i < expected.length; i++) {
		var exp = expected[i];
		var act = actual[i];
		act.should.have.property('keyword', exp.keyword);
		act.should.have.property('priority', exp.priority);
		act.should.have.property('message', exp.message);
		act.should.have.property('affix', exp.affix);
		act.should.have.property('affixLimits')
			.that.is.an('array')
			.with.lengthOf(act.affixLimits.length);
		act.should.have.property('word')
			.that.is.an('object');
		act.word.should.have.property('orcish', exp.word.orcish);
		act.word.should.have.property('english', exp.word.english);
		act.word.should.have.property('PoS', exp.word.PoS);
		act.word.should.have.property('num', exp.word.num);
	}
}

function compare(a, b) {
	if (a.keyword < b.keyword) {
		return -1;
	}
	if (a.keyword > b.keyword) {
		return 1;
	}
	if (a.message < b.message) {
		return -1;
	}
	if (a.message > b.message) {
		return 1;
	}
	if (a.priority < b.priority) {
		return -1;
	}
	if (a.priority > b.priority) {
		return 1;
	}
	if (a.affix < b.affix) {
		return -1;
	}
	if (a.affix > b.affix) {
		return 1;
	}
	if (a.affixLimits.length < b.affixLimits.length) {
		return -1;
	}
	if (a.affixLimits.length > b.affixLimits.length) {
		return 1;
	}
	if (a.word.orcish < b.word.orcish) {
		return -1;
	}
	if (a.word.orcish > b.word.orcish) {
		return 1;
	}
	if (a.word.num < b.word.num) {
		return -1;
	}
	if (a.word.num > b.word.num) {
		return 1;
	}
	if (a.word.english < b.word.english) {
		return -1;
	}
	if (a.word.english > b.word.english) {
		return 1;
	}
	if (a.word.PoS < b.word.PoS) {
		return -1;
	}
	if (a.word.PoS > b.word.PoS) {
		return 1;
	}
	return 0;
}

function sleep(timeout) {
	return function() {
		return new Promise(function(resolve, reject) {
			setTimeout(resolve, timeout);
		});
	};
}

describe('Indexes', function() {
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
		})
		.then(function() {
			return SearchIndex.deleteMany({});
		});
	});

	it('it should start with no SearchIndexes', function() {
		return SearchIndex.find({}).exec()
		.then(function(searchIndexes) {
			searchIndexes.should.be.an('array');
			searchIndexes.length.should.eql(0);
		});
	});

	it('it should be correct after a word is inserted', function() {
		return agent
		.post('/api/words')
		.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
		.send({
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal'
		})
		.then(function() {
			return SearchIndex.find({}).exec();
		})
		.then(function(searchIndexes) {
			test(searchData.with1(), searchIndexes);
		});
	});

	it('it should be correct with nouns that do not decline', function() {
		return agent
		.post('/api/words')
		.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
		.send(searchData.duliNoun())
		.then(function() {
			return SearchIndex.find({}).exec();
		})
		.then(function(searchIndexes) {
			test(searchData.withDuliNoun(), searchIndexes);
		});
	});

	it('it should be correct with adjectives that do not decline', function() {
		return agent
		.post('/api/words')
		.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
		.send(searchData.duliAdjective())
		.then(function() {
			return SearchIndex.find({}).exec();
		})
		.then(function(searchIndexes) {
			test(searchData.withDuliAdjective(), searchIndexes);
		});
	});

	describe('with some Words and SearchIndexes already added', function() {
		beforeEach(function() {
			return Word.deleteMany({})
			.then(function() {
				return SearchIndex.deleteMany({});
			})
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
			})
			.then(function() {
				return SearchIndex.insertMany(searchData.with123());
			});
		});

		it('it should start with the correct SearchIndexes', function() {
			return SearchIndex.find({}).exec()
			.then(function(searchIndexes) {
				test(searchData.with123(), searchIndexes);
			});
		});

		it('it should be correct after a word is inserted', function() {
			return agent
			.post('/api/words')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				orcish: 'lex',
				english: 'four',
				PoS: 'cardinal'
			})
			.then(function() {
				return SearchIndex.find({}).exec();
			})
			.then(function(searchIndexes) {
				test(searchData.with1234(), searchIndexes);
			});
		});

		it('it should be correct after a word is changed', function() {
			return agent
			.put('/api/words/thaen/1')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				orcish: 'lex',
				english: 'four',
				PoS: 'cardinal'
			})
			.then(sleep(10))
			.then(function() {
				return SearchIndex.find({}).exec();
			})
			.then(function(searchIndexes) {
				test(searchData.with124(), searchIndexes);
			});
		});

		it('it should be correct after a word is removed', function() {
			return agent
			.delete('/api/words/thaen/1')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.then(function() {
				return SearchIndex.find({}).exec();
			})
			.then(function(searchIndexes) {
				test(searchData.with12(), searchIndexes);
			});
		});

		it('it should be correct after bulkadd with method unique',
		function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: bulkAddData.cardinalMinYayDataCsvEop(),
				encoding: 'csv',
				updateMethod: 'unique',
				order: 'e-o-p'
			})
			.then(function() {
				return SearchIndex.find({}).exec();
			})
			.then(function(searchIndexes) {
				test(searchData.with12345(), searchIndexes);
			});
		});

		it('it should be correct after bulkadd with method remove',
		function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: bulkAddData.cardinalMinYayDataCsvEop(),
				encoding: 'csv',
				updateMethod: 'remove',
				order: 'e-o-p'
			})
			.then(sleep(10))
			.then(function() {
				return SearchIndex.find({}).exec();
			})
			.then(function(searchIndexes) {
				test(searchData.with123yay45(), searchIndexes);
			});
		});

		it('it should be correct after bulkadd with method duplicate',
		function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: bulkAddData.cardinalMinYayDataCsvEop(),
				encoding: 'csv',
				updateMethod: 'duplicate',
				order: 'e-o-p'
			})
			.then(function() {
				return SearchIndex.find({}).exec();
			})
			.then(function(searchIndexes) {
				test(searchData.with1233yay45(), searchIndexes);
			});
		});

		it('it should be the same after an error with bulkadd', function() {
			return agent
			.post('/api/bulkadd')
			.set('X-XSRF-TOKEN', cookies['XSRF-TOKEN'])
			.send({
				data: bulkAddData.errorDataCsvEop(),
				encoding: 'csv',
				updateMethod: 'remove',
				order: 'e-o-p'
			})
			.then(function(res) {
				res.should.have.status(404);
				return SearchIndex.find({}).exec();
			})
			.then(function(searchIndexes) {
				test(searchData.with123(), searchIndexes);
			});
		});
	});
});
