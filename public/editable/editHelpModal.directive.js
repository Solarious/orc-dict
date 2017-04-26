(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditHelpModal', editHelpModal);

function editHelpModal() {
	var directive = {
		restrict: 'E',
		scope: {
			modalId: '@'
		},
		templateUrl: 'editable/editHelpModal.directive.html'
	};

	return directive;
}

})();
