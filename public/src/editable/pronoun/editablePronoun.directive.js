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
		templateUrl: 'src/editable/pronoun/editablePronoun.directive.html'
	};

	return directive;
}

})();
