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
			closeText: '@',
			modalId: '@',
			classes: '@',
			btnType: '@'
		},
		compile: compileModal,
		templateUrl: 'src/shared/modal.directive.html'

	};

	function compileModal(element, attr) {
		if (!attr.btnType) {
			attr.btnType = 'danger';
		}
	}

	return directive;
}

})();
