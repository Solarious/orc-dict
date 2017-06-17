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
		vm.updateMethod = 'duplicate';
		vm.order = 'o-p-e';
	}

	function submit() {
		vm.submitDisabled = true;
		WordsService.bulkAdd(vm.data, vm.encoding, vm.updateMethod, vm.order)
		.then(function(results) {
			if (results.failures.length > 0) {
				var plural = (results.failures.length === 1) ? '' : 's';
				var msg = 'While ' + results.successes.length + ' word';
				msg += plural + ' have been successfully added, ';
				msg += results.failures.length + ' have not been due to the';
				msg += ' following error' + plural;
				for (var i = results.failures.length - 1; i >= 0; i--) {
					var failure = results.failures[i];
					var word = failure.word;
					var errMsg = '\n"' + word.orcish + ', ' + word.PoS + ', ';
					errMsg += word.english + '": ' + failure.errorMessage;
					AlertService.error(errMsg);
				}
				AlertService.warning(msg);
				vm.submitDisabled = false;
			} else {
				var num = results.successes.length;
				if (num === 0) {
					AlertService.successDeferred('no words added');
				} else if (num === 1) {
					AlertService.successDeferred('1 word added');
				} else {
					AlertService.successDeferred(num + ' words added');
				}
				$location.path('/admin');
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
