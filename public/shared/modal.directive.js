(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictModal', modal);

function modal() {
	var directive = {
		restrict: 'E',
		transclude: true,
		scope: {
			actionFunction: '&',
			actionText: '@',
			modalId: '@'
		},
		templateUrl: 'shared/modal.directive.html'
	};

	return directive;
}

})();
