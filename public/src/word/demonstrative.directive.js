(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictDemonstrative', demonstrative);

function demonstrative() {
	var directive = {
		restrict: 'E',
		scope: {
			demonstrative: '='
		},
		templateUrl: 'src/word/demonstrative.directive.html'
	};

	return directive;
}

})();
