(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('BulkAddClanController', BulkAddClanController);

BulkAddClanController.$inject = [
	'ClansService', '$location', 'AlertService'
];

function BulkAddClanController(ClansService, $location, AlertService) {
	var vm = this;

	vm.submit = submit;
	vm.onload = onload;

	activate();

	function activate() {
		vm.submitDisabled = false;
	}

	function submit() {
		vm.submitDisabled = true;
		ClansService.bulkAdd(vm.data)
		.then(function(results) {
			var num = results.clans.length;
			if (num === 0) {
				AlertService.successDeferred('no clans added');
			} else if (num === 1) {
				AlertService.successDeferred('1 clan added');
			} else {
				AlertService.successDeferred(num + ' clans added');
			}
			$location.path('/clans');
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error');
			vm.submitDisabled = false;
		});
	}

	function onload(data) {
		vm.data = data;
	}
}

})();
