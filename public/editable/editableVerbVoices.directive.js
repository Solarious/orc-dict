(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableVerbVoices', editableVerbVoices);

function editableVerbVoices() {
	var directive = {
		restrict: 'E',
		scope: {
			active: '=',
			passive: '='
		},
		templateUrl: 'editable/editableVerbVoices.directive.html'
	};

	return directive;
}

})();
