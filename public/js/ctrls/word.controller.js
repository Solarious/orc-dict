(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('WordController', WordController);

WordController.$inject = ['$routeParams'];

function WordController($routeParams) {
	var vm = this;

	vm.orcish = $routeParams.orcish;
}

})();

