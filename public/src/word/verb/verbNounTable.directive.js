(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictVerbNounTable', verbNounTable);

function verbNounTable() {
	var directive = {
		restrict: 'E',
		scope: {
			noun: '=',
			title: '@'
		},
		templateUrl: 'src/word/verb/verbNounTable.directive.html'
	};

	return directive;
}

})();
