(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('ClanController', ClanController);

ClanController.$inject = ['$routeParams', 'ClansService', 'AlertService',
'AuthService'];

function ClanController($routeParams, ClansService, AlertService, AuthService) {
	var vm = this;

	vm.isLoggedIn = isLoggedIn;

	activate();

	function activate() {
		vm.name = $routeParams.name;

		return ClansService.get(vm.name)
		.then(function(data) {
			vm.clan = data;
			return vm.clan;
		}, function(error) {
			AlertService.error(error);
		});
	}

	function isLoggedIn() {
		return AuthService.isLoggedIn();
	}
}

})();
