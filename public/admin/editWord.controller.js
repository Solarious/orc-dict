(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('EditWordController', EditWordController);

EditWordController.$inject = ['$routeParams', 'WordsService', '$location',
'AlertService'];

function EditWordController($routeParams, WordsService, $location,
AlertService) {
	var vm = this;

	vm.autofill = autofill;
	vm.update = update;

	activate();

	function activate() {
		vm.orcish = $routeParams.orcish;
		vm.submitDisabled = true;

		return WordsService.get(vm.orcish)
		.then(function(data) {
			vm.word = data;
			vm.submitDisabled = false;
			return vm.word;
		}, function(error) {
			AlertService.error(error);
		});
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
				vm.errorMessage = err;
			});
		}
	}

	function update() {
		vm.submitDisabled = true;
		WordsService.update(vm.orcish, vm.word)
		.then(function() {
			$location.path('/admin');
			var w = [vm.word.orcish, vm.word.english, vm.word.PoS].join(', ');
			AlertService.successDeferred('Word "' + w + '" updated');
		}, function(error) {
			AlertService.error(error || 'Unknown error updating word');
			vm.submitDisabled = false;
		});
	}
}

})();
