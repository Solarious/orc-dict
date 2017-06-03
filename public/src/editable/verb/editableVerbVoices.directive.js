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
		templateUrl: 'src/editable/verb/editableVerbVoices.directive.html'
	};

	return directive;
}

})();
