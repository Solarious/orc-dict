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
		templateUrl: 'word/verbConjTable.directive.html'
	};

	return directive;
}

})();
