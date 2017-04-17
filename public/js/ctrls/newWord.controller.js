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
		var partName = vm.word.PoS;
		if (vm.word.PoS != "") {
			WordsService.autofill(vm.word.PoS, vm.word.orcish)
			.then(function(data) {
				vm.word[partName] = data;
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
			var defaultErrorMessage = 'Unknown error creating word';
			vm.errorMessage = error || defaultErrorMessage;
			vm.submitDisabled = false;
		});
	}
}

})();
