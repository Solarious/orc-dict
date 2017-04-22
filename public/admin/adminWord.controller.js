(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('AdminWordController', AdminWordController);

AdminWordController.$inject = ['$routeParams', 'WordsService', '$location'];

function AdminWordController($routeParams, WordsService, $location) {
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
		}, function(error) {
			var defaultErrorMessage = 'Unknown error updating word';
			vm.errorMessage = error || defaultErrorMessage;
			vm.submitDisabled = false;
		});
	}
}

})();
