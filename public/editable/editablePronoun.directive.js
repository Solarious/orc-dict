(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditablePronoun', editablePronoun);

function editablePronoun() {
	var directive = {
		restrict: 'E',
		scope: {
			pronoun: '='
		},
		templateUrl: 'editable/editablePronoun.directive.html'
	};

	return directive;
}

})();
