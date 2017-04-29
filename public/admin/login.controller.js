(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('LoginController', LoginController);

LoginController.$inject = ['$location', 'AuthService', 'AlertService'];

function LoginController($location, AuthService, AlertService) {
	var vm = this;

	vm.login = login;

	activate();

	function activate() {
		vm.disabled = false;
	}

	function login() {
		vm.disabled = true;

		AuthService.login(vm.username, vm.password)
		.then(function() {
			$location.path('/');
			vm.disabled = false;
			vm.username = '';
			vm.password = '';
		}, function(error) {
			console.log(error);
			AlertService.error(
				error || 'Invalid username and/or password'
			);
			vm.disabled = false;
			vm.username = '';
			vm.password = '';
		});
	}
}

})();
