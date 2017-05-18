(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableNoun', editableNoun);

function editableNoun() {
	var directive = {
		restrict: 'E',
		scope: {
			noun: '='
		},
		templateUrl: 'src/editable/editableNoun.directive.html'
	};

	return directive;
}

})();
