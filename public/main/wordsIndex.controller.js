(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('WordsIndexController', WordsIndexController);

WordsIndexController.$inject = ['WordsService', 'AlertService'];

function WordsIndexController(WordsService, AlertService) {
	var vm = this;

	activate();

	function activate() {
		return WordsService.get()
		.then(function(data) {
			vm.words = data;
			return vm.words;
		}, function(error) {
			AlertService.error(error);
		});
	}
}

})();
