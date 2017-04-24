(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictPossessive', possessive);

function possessive() {
	var directive = {
		restrict: 'E',
		scope: {
			possessive: '='
		},
		templateUrl: 'word/possessive.directive.html'
	};

	return directive;
}

})();
