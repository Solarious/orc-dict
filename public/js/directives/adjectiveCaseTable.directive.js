(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictAdjectiveCaseTable', adjectiveCaseTable);

function adjectiveCaseTable() {
	var directive = {
		restrict: 'E',
		scope: {
			caseGroup: '=',
			title: '@'
		},
		templateUrl: 'views/adjectiveCaseTable.directive.html'
	};

	return directive;
}

})();
