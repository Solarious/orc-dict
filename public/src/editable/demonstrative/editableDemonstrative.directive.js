(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableDemonstrative', editableDemonstrative);

function editableDemonstrative() {
	var directive = {
		restrict: 'E',
		scope: {
			demonstrative: '='
		},
		templateUrl: 'src/editable/demonstrative/editableDemonstrative.directive.html'
	};

	return directive;
}

})();