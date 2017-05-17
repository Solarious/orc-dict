'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server');
var autofill = require('../app/autofill');
var exampleWords = require('./exampleWords')();

chai.use(chaiHttp);

describe('Autofill', function() {

	describe('other PoS', function() {
		var cannotUsePoS = [
			'adverb',
			'cardinal',
			'conjunction',
			'demonstrative',
			'exclamation',
			'interjection',
			'possessive',
			'preposition',
			'pronoun',
			'relative',
			'prefix',
			'suffix'
		];

		cannotUsePoS.forEach(function(PoS) {
			it('it should return an error for PoS ' + PoS, function() {
				return chai.request(server)
				.get('/api/autofill/' + PoS + '/thaen')
				.catch(function(error) {
					error.res.should.have.status(404);
					error.res.text.should.be.a('string');
					error.res.text.should.eql(
						'Can not use autofill with PoS: ' + PoS
					);
				});
			});
		});
	});

	describe('invalid PoS', function() {
		var invalidPoS = [
			'qea',
			'piqx',
			'14hcva',
			'demonstratives',
			'affix',
			'notapos'
		];

		invalidPoS.forEach(function(PoS) {
			it('it should return an error for PoS ' + PoS, function() {
				return chai.request(server)
				.get('/api/autofill/' + PoS + '/thaen')
				.catch(function(error) {
					error.res.should.have.status(404);
					error.res.text.should.be.a('string');
					error.res.text.should.eql(
						'Invalid PoS: ' + PoS
					);
				});
			});
		});
	});

	describe('nouns', function() {
		exampleWords.forEach(function(word) {
			if (word.PoS === 'noun') {
				var str = word.orcish + ', ' + word.PoS + ', ' + word.english;
				it('it should handle "' + str + '" correctly', function() {
					return chai.request(server)
					.get('/api/autofillword/' + word.PoS + '/' + word.orcish)
					.then(function(res) {
						res.should.have.status(200);
						res.body.should.be.an('object');
						res.body.should.eql(word.noun);
					});
				});
			}
		});
	});
});
