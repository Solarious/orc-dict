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

	activate();

	function activate() {
		vm.submitDisabled = false;
		vm.encoding = 'csv';
		vm.remove = 'true';
	}

	function submit() {
		vm.submitDisabled = true;
		WordsService.bulkAdd(vm.data, vm.encoding, vm.remove)
		.then(function() {
			$location.path('/admin');
		}, function(error) {
			AlertService.error(error || 'Unknown error');
			vm.submitDisabled = false;
		});
	}

	function onload(data) {
		vm.data = data;
	}
}

})();
