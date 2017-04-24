(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictPronoun', pronoun);

function pronoun() {
	var directive = {
		restrict: 'E',
		scope: {
			pronoun: '='
		},
		templateUrl: 'word/pronoun.directive.html'
	};

	return directive;
}

})();
