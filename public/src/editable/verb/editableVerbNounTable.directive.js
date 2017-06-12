(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableVerbNounTable', editableVerbNounTable);

function editableVerbNounTable() {
	var directive = {
		restrict: 'E',
		scope: {
			noun: '=',
			title: '@'
		},
		templateUrl: 'src/editable/verb/editableVerbNounTable.directive.html'
	};

	return directive;
}

})();
