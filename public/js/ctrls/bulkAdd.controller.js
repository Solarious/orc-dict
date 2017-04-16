(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('BulkAddController', BulkAddController);

BulkAddController.$inject = ['WordsService', '$location'];

function BulkAddController(WordsService, $location) {
	var vm = this;

	vm.submit = submit;

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
			var defaultErrorMessage = 'Unknown error';
			vm.errorMessage = error || defaultErrorMessage;
			vm.submitDisabled = false;
		});
	}
}

})();
