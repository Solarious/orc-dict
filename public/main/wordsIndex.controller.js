(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('WordsIndexController', WordsIndexController);

WordsIndexController.$inject = ['WordsService', 'AlertService'];

function WordsIndexController(WordsService, AlertService) {
	var vm = this;
}

})();
