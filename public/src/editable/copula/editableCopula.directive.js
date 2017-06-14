(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableCopula', editableCopula);

function editableCopula() {
	var directive = {
		restrict: 'E',
		scope: {
			copula: '='
		},
		templateUrl: 'src/editable/copula/editableCopula.directive.html'
	};

	return directive;
}

})();
