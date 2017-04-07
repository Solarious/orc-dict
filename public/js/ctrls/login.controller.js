(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('LoginController', LoginController);

LoginController.$inject = ['$location', 'AuthService'];

function LoginController($location, AuthService) {
	var vm = this;

	vm.login = login;

	function login() {
		vm.login = login;
		vm.error = false;
		vm.disabled = true;

		AuthService.login(vm.username, vm.password)
		.then(function() {
			$location.path('/');
			vm.disabled = false;
			vm.username = '';
			vm.password = '';
		}, function(data) {
			vm.error = true;
			var defaultErrorMessage = 'Invalid username and/or password';
			vm.errorMessage = data.err.message || defaultErrorMessage;
			vm.disabled = false;
			vm.username = '';
			vm.password = '';
		});
	}
}

})();

