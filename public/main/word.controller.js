(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('WordController', WordController);

WordController.$inject = ['$routeParams', 'WordsService', 'AlertService'];

function WordController($routeParams, WordsService, AlertService) {
	var vm = this;

	activate();

	function activate() {
		vm.orcish = $routeParams.orcish;

		return WordsService.get(vm.orcish)
		.then(function(data) {
			vm.word = data;
			return vm.word;
		}, function(error) {
			AlertService.error(error);
		});
	}
}

})();
