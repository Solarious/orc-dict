(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictCopula', copula);

function copula() {
	var directive = {
		restrict: 'E',
		scope: {
			copula: '='
		},
		templateUrl: 'src/word/copula/copula.directive.html'
	};

	return directive;
}

})();
