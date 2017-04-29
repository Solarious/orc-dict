(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('ResetController', ResetController);

ResetController.$inject = ['$routeParams', '$location', 'AuthService',
'AlertService'];

function ResetController($routeParams, $location, AuthService, AlertService) {
	var vm = this;

	vm.reset = reset;

	activate();

	function activate() {
		vm.token = $routeParams.token;
		vm.disabled = false;
	}

	function reset() {
		if (vm.newPassword === '') {
			return AlertService.error('Password must not be empty');
		}
		if (vm.newPassword !== vm.confirmPassword) {
			return AlertService.error('Passwords do not match');
		}

		vm.disabled = true;

		AuthService.resetPassword(vm.token, vm.newPassword)
		.then(function() {
			$location.path('/login');
			vm.disabled = false;
			vm.newPassword = '';
			vm.confirmPassword = '';
			AlertService.successDeferred('Your password has been reset');
		}, function(error) {
			AlertService.error(error || 'Unknown error');
			vm.disabled = false;
		});
	}
}

})();
