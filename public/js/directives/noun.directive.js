(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictNoun', noun);

function noun() {
	var directive = {
		restrict: 'E',
		scope: {
			noun: '='
		},
		templateUrl: 'views/noun.directive.html'
	};

	return directive;
}

})();
