(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('BulkAddController', BulkAddController);

BulkAddController.$inject = ['WordsService', '$location', 'AlertService'];

function BulkAddController(WordsService, $location, AlertService) {
	var vm = this;

	vm.submit = submit;
	vm.onload = onload;
	vm.showHelpModal = showHelpModal;

	activate();

	function activate() {
		vm.submitDisabled = false;
		vm.encoding = 'csv';
		vm.updateMethod = 'unique';
	}

	function submit() {
		vm.submitDisabled = true;
		WordsService.bulkAdd(vm.data, vm.encoding, vm.updateMethod)
		.then(function(results) {
			$location.path('/admin');
			results = results || [];
			var num = results.length;
			if (num === 0) {
				AlertService.successDeferred('No words added');
			} else if (num === 1) {
				AlertService.successDeferred('One word added');
			} else {
				AlertService.successDeferred(num + ' Words added');
			}
		}, function(error) {
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
