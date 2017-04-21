(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableAdjective', editableAdjective);

function editableAdjective() {
	var directive = {
		restrict: 'E',
		scope: {
			adjective: '='
		},
		templateUrl: 'editable/editableAdjective.directive.html'
	};

	return directive;
}

})();
