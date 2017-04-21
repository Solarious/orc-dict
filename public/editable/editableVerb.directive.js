(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableVerb', editableVerb);

function editableVerb() {
	var directive = {
		restrict: 'E',
		scope: {
			verb: '='
		},
		templateUrl: 'editable/editableVerb.directive.html'
	};

	return directive;
}

})();
