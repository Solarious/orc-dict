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
		templateUrl: 'src/word/relative/relative.directive.html'
	};

	return directive;
}

})();
