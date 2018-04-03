'use strict';

module.exports = {
	getWordGroups: getWordGroups,
};

function getWordGroups() {
	return [
		{
			unordered: ['reshar', 'resax', 'resvax'],
			ordered: ['resax', 'resvax', 'reshar'],
		},
		{
			unordered: [
				'r', 'w', 'i', 'p', 'b', 'd', 'dj', 'h', 't', 'f', 'o', 'x', 'zs',
				'n', 'th', 'k', 'v', 'sh', 'l', 'ch', 's', 'z', 'u', 'm', 'a',
				'e', 'y'
			],
			ordered: [
				'a', 'b', 'ch', 'd', 'e', 'f', 'h', 'i', 'dj', 'k', 'l', 'm', 'n',
				'o', 'p', 'r', 's', 'sh', 't', 'th', 'u', 'v', 'w', 'x', 'y', 'z',
				'zs'
			]
		}
	];
}
