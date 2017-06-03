(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictVerbConjTable', verbConjTable);

function verbConjTable() {
	var directive = {
		restrict: 'E',
		scope: {
			conj: '=',
			title: '@'
		},
		templateUrl: 'src/word/verb/verbConjTable.directive.html'
	};

	return directive;
}

})();
