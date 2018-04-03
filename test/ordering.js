'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var Word = require('../app/models/word');
var User = require('../app/models/user');
var exampleOrderings = require('./exampleOrderings');

chai.use(chaiHttp);

describe('Ordering', function() {
	beforeEach(function() {
		return Word.remove({});
	});

	exampleOrderings.getWordGroups().forEach(function(group) {
		it('it should order [' + group.unordered + '] correctly', function() {
			return Word.insertMany(group.unordered.map(function(orcish) {
				return {
					orcish: orcish,
					english: 'english',
					PoS: 'cardinal'
				};
			}))
			.then(function() {
				return chai.request(server)
				.get('/api/words')
				.query({ sort: 'orderedOrcish' });
			})
			.then(function(res) {
				res.should.have.status(200);
				res.body.should.be.an('object');
				res.body.should.have.property('words');
				res.body.words.should.be.an('array');
				res.body.words.map(function(word) {
					return word.orcish;
				}).should.eql(group.ordered);
			});
		});
	});
});
