(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictBulkAddSentenceHelpModal', bulkAddSentenceHelpModal);

function bulkAddSentenceHelpModal() {
	var directive = {
		restrict: 'E',
		scope: {
			modalId: '@'
		},
		templateUrl:
		'src/sentence/bulkAdd/bulkAddSentenceHelpModal.directive.html'
	};

	return directive;
}

})();
