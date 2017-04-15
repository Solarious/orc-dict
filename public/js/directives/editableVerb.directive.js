(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableVerb', editableVerb);

function editableVerb() {
	var directive = {
		restrict: 'E',
		scope: {
			verb: '='
		},
		templateUrl: 'views/editableVerb.directive.html'
	};

	return directive;
}

})();
