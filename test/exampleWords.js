'use strict';

module.exports = getWords;

function getWords() {
	return [
		{
			orcish: 'ork',
			english: 'orc',
			PoS: 'noun',
			noun: {
				declension: 'second',
				gender: 'masculine',
				nominative: {
					singular: 'ork',
					plural: 'orkulz'
				},
				genitive: {
					singular: 'orku',
					plural: 'orkurru'
				},
				dative: {
					singular: 'orko',
					plural: 'orkors'
				},
				accusative: {
					singular: 'orkudz',
					plural: 'orkuluz'
				},
				vocative: {
					singular: 'orko',
					plural: 'orkors'
				}
			}
		}
	];
}
