(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('NewWordController', NewWordController);

NewWordController.$inject = ['WordsService', '$location'];

function NewWordController(WordsService, $location) {
	var vm = this;

	vm.autofill = autofill;
	vm.submit = submit;

	activate();

	function activate() {
		vm.word = {};
		vm.submitDisabled = false;
	}

	function autofill() {
		if (vm.word.PoS === 'verb') {
			WordsService.autofill(vm.word.PoS, vm.word.orcish)
			.then(function(data) {
				vm.word.verb = data;
			}, function(err) {
				vm.errorMessage = err;
			});
		} else if (vm.word.PoS === 'noun') {
			WordsService.autofill(vm.word.PoS, vm.word.orcish)
			.then(function(data) {
				vm.word.noun = data;
			}, function(err) {
				vm.errorMessage = err;
			});
		}
	}

	function submit() {
		vm.submitDisabled = true;
		WordsService.create(vm.word)
		.then(function() {
			$location.path('/admin');
		}, function(error) {
			var defaultErrorMessage = 'Unknown error createing word';
			vm.errorMessage = data.error.message || defaultErrorMessage;
			vm.submitDisabled = false;
		});
	}
}

})();
