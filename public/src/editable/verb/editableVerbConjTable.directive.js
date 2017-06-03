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
		templateUrl: 'src/editable/verb/editableVerbConjTable.directive.html'
	};

	return directive;
}

})();
