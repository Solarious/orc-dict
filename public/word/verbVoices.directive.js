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
		templateUrl: 'word/verbVoices.directive.html'
	};

	return directive;
}

})();

