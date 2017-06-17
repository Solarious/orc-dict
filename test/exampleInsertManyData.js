'use strict';

module.exports = {
	initialWords: initialWords,
	insertingWords: insertingWords,
	returnedWords: returnedWords,
	finalWords: finalWords
};

function initialWords() {
	return [
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
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal'
		}
	];
}

function insertingWords() {
	return [
		{
			orcish: 'thaen',
			english: 'three',
			PoS: 'cardinal'
		},
		{
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'enyet',
			english: 'still',
			PoS: 'adverb'
		},
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 1
		}
	];
}

function returnedWords() {
	return [
		{
			orcish: 'thaen',
			english: 'three',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal',
			num: 2
		},
		{
			orcish: 'enyet',
			english: 'still',
			PoS: 'adverb',
			num: 1
		},
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 3
		}
	];
}

function finalWords() {
	return [
		{
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal',
			num: 2
		},
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 2
		},
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 3
		},
		{
			orcish: 'thaen',
			english: 'three',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'enyet',
			english: 'still',
			PoS: 'adverb',
			num: 1
		}
	];
}
