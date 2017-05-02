(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictBulkAddHelpModal', bulkAddHelpModal);

function bulkAddHelpModal() {
	var directive = {
		restrict: 'E',
		scope: {
			modalId: '@'
		},
		templateUrl: 'admin/bulkAddHelpModal.directive.html'
	};

	return directive;
}

})();
