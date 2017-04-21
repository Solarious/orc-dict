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
		templateUrl: 'word/adjective.directive.html'
	};

	return directive;
}

})();
