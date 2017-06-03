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
		templateUrl: 'src/word/pronoun/pronoun.directive.html'
	};

	return directive;
}

})();
