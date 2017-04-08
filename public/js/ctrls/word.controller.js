(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('WordController', WordController);

WordController.$inject = ['$routeParams', 'WordsService'];

function WordController($routeParams, WordsService) {
	var vm = this;

	activate();

	function activate() {
		vm.orcish = $routeParams.orcish;

		return WordsService.get(vm.orcish)
		.then(function(data) {
			vm.word = data;
			return vm.word;
		});
	}
}

})();
