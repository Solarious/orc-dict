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
		templateUrl: 'src/editable/adjective/editableAdjectiveCaseTable.directive.html'
	};

	return directive;
}

})();
