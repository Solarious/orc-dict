(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictRelative', relative);

function relative() {
	var directive = {
		restrict: 'E',
		scope: {
			relative: '='
		},
		templateUrl: 'word/relative.directive.html'
	};

	return directive;
}

})();
