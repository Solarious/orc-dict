(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictVerb', verb);

function verb() {
	var directive = {
		restrict: 'E',
		scope: {
			word: '='
		},
		templateUrl: 'views/verb.directive.html'
	};

	return directive;
}

})();
