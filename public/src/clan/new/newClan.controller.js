(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('NewClanController', NewClanController);

NewClanController.$inject = [
	'ClansService', '$location', 'AlertService'
];

function NewClanController(ClansService, $location, AlertService) {
	var vm = this;

	vm.submit = submit;

	activate();

	function activate() {
		vm.clan = {
			name: '',
			orcishName: '',
			shortDesc: '',
			history: [],
			customs: [],
			relations: []
		};
		vm.submitDisabled = false;
	}

	function submit() {
		vm.submitDisabled = true;
		ClansService.create(vm.clan)
		.then(function() {
			$location.path('/clans');
			AlertService.successDeferred('Clan created: ' + vm.clan.name);
		}, function(error) {
			AlertService.error(error || 'Unknown error creating clan');
			vm.submitDisabled = false;
		});
	}
}

})();
