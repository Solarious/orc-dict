(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictAdjective', adjective);

function adjective() {
	var directive = {
		restrict: 'E',
		scope: {
			adjective: '='
		},
		templateUrl: 'src/word/adjective/adjective.directive.html'
	};

	return directive;
}

})();
