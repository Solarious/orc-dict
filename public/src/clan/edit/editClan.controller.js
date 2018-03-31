(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('EditClanController', EditClanController);

EditClanController.$inject = [
	'ClansService', '$location', 'AlertService', '$routeParams'
];

function EditClanController(ClansService, $location, AlertService, $routeParams) {
	var vm = this;

	vm.update = update;

	activate();

	function activate() {
		vm.name = $routeParams.name;
		vm.submitDisabled = true;

		return ClansService.get(vm.name)
		.then(function(data) {
			vm.clan = data;
			vm.submitDisabled = false;
		})
		.catch(function(error) {
			AlertService.error(error);
		});
	}

	function update() {
		vm.submitDisabled = true;
		ClansService.update(vm.name, vm.clan)
		.then(function() {
			$location.path('/clans');
			AlertService.successDeferred('Clan updated: ' + vm.clan.name);
		}, function(error) {
			AlertService.error(error || 'Unknown error updating clan');
			vm.submitDisabled = false;
		});
	}
}

})();
