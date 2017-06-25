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
		vm.num = $routeParams.num;
		vm.submitDisabled = true;

		return WordsService.get(vm.orcish, vm.num)
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
				AlertService.error(err || 'Unknown error with autofill');
			});
		}
	}

	function update() {
		vm.submitDisabled = true;
		WordsService.update(vm.orcish, vm.num, vm.word)
		.then(function(word) {
			$location.path('/admin');
			var w = [word.orcish, word.PoS, word.english].join(', ');
			AlertService.successDeferred('Word "' + w + '" updated');
		}, function(error) {
			AlertService.error(error || 'Unknown error updating word');
			vm.submitDisabled = false;
		});
	}
}

})();
