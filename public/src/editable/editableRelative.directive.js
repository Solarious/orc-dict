(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableRelative', editableRelative);

function editableRelative() {
	var directive = {
		restrict: 'E',
		scope: {
			relative: '='
		},
		templateUrl: 'src/editable/editableRelative.directive.html'
	};

	return directive;
}

})();
