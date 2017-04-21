(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictVerbVoices', verbVoices);

function verbVoices() {
	var directive = {
		restrict: 'E',
		scope: {
			active: '=',
			passive: '='
		},
		templateUrl: 'views/verbVoices.directive.html'
	};

	return directive;
}

})();

