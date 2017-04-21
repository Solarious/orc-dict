(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictVerb', verb);

function verb() {
	var directive = {
		restrict: 'E',
		scope: {
			verb: '='
		},
		templateUrl: 'word/verb.directive.html'
	};

	return directive;
}

})();
