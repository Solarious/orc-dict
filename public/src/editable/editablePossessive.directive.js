(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditablePossessive', editablePossessive);

function editablePossessive() {
	var directive = {
		restrict: 'E',
		scope: {
			possessive: '='
		},
		templateUrl: 'src/editable/editablePossessive.directive.html'
	};

	return directive;
}

})();
