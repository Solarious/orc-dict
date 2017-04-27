(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictAffix', affix);

function affix() {
	var directive = {
		restrict: 'E',
		scope: {
			affix: '='
		},
		templateUrl: 'word/affix.directive.html'
	};

	return directive;
}

})();
