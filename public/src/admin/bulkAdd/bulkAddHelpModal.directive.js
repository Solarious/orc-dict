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
		templateUrl: 'src/admin/bulkAdd/bulkAddHelpModal.directive.html'
	};

	return directive;
}

})();
