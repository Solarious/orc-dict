(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictWord', word);

function word() {
	var directive = {
		restrict: 'E',
		scope: {
			word: '='
		},
		templateUrl: 'views/word.directive.html'
	};

	return directive;
}

})();
