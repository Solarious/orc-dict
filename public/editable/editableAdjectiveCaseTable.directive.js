(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableAdjectiveCaseTable', editableAdjectiveCaseTable);

function editableAdjectiveCaseTable() {
	var directive = {
		restrict: 'E',
		scope: {
			caseGroup: '=',
			title: '@'
		},
		templateUrl: 'editable/editableAdjectiveCaseTable.directive.html'
	};

	return directive;
}

})();