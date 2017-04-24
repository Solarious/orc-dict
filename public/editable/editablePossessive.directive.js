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
		templateUrl: 'editable/editablePossessive.directive.html'
	};

	return directive;
}

})();
