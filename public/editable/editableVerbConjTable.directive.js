(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableVerbConjTable', editableVerbConjTable);

function editableVerbConjTable() {
	var directive = {
		restrict: 'E',
		scope: {
			conj: '=',
			title: '@'
		},
		templateUrl: 'views/editableVerbConjTable.directive.html'
	};

	return directive;
}

})();
