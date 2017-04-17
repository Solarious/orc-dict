(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictAdjective', adjective);

function adjective() {
	var directive = {
		restrict: 'E',
		scope: {
			word: '='
		},
		templateUrl: 'views/adjective.directive.html'
	};

	return directive;
}

})();
