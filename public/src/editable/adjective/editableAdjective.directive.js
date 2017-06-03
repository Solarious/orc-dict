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
		templateUrl: 'src/editable/adjective/editableAdjective.directive.html'
	};

	return directive;
}

})();
