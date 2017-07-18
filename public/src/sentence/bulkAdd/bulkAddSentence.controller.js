(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('BulkAddSentenceController', BulkAddSentenceController);

BulkAddSentenceController.$inject = [
	'SentencesService', '$location', 'AlertService'
];

function BulkAddSentenceController(SentencesService, $location, AlertService) {
	var vm = this;

	vm.submit = submit;
	vm.onload = onload;
	vm.showHelpModal = showHelpModal;

	activate();

	function activate() {
		vm.submitDisabled = false;
	}

	function submit() {
		vm.submitDisabled = true;
		SentencesService.bulkAdd(vm.data)
		.then(function(results) {
			var num = results.sentences.length;
			if (num === 0) {
				AlertService.successDeferred('no sentences added');
			} else if (num === 1) {
				AlertService.successDeferred('1 sentence added');
			} else {
				AlertService.successDeferred(num + ' sentences added');
			}
			$location.path('/sentences');
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error');
			vm.submitDisabled = false;
		});
	}

	function onload(data) {
		vm.data = data;
	}

	function showHelpModal() {
		$('#helpModal').modal('show');
	}
}

})();
