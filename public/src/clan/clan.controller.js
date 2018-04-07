(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('ClanController', ClanController);

ClanController.$inject = ['$routeParams', 'ClansService', 'AlertService'];

function ClanController($routeParams, ClansService, AlertService) {
	var vm = this;

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
}

})();
