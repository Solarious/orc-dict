(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('NewWordController', NewWordController);

NewWordController.$inject = ['WordsService', '$location', 'AlertService'];

function NewWordController(WordsService, $location, AlertService) {
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
		if (vm.word.PoS !== "") {
			WordsService.autofill(vm.word.PoS, vm.word.orcish)
			.then(function(data) {
				if (!angular.equals(data, {})) {
					vm.word[partName] = data;
				}
			}, function(err) {
				AlertService.error(err || 'Unknown error with autofill');
			});
		}
	}

	function submit() {
		vm.submitDisabled = true;
		WordsService.create(vm.word)
		.then(function(word) {
			$location.path('/admin');
			var w = [word.orcish, word.PoS, word.english].join(', ');
			AlertService.successDeferred('Word "' + w + '" created');
		}, function(error) {
			AlertService.error(error || 'Unknown error creating word');
			vm.submitDisabled = false;
		});
	}
}

})();
