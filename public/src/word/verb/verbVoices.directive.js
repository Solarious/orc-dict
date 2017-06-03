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
		templateUrl: 'src/word/verb/verbVoices.directive.html'
	};

	return directive;
}

})();

