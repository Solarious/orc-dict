(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('ForgotController', ForgotController);

ForgotController.$inject = ['$location', 'AuthService', 'AlertService'];

function ForgotController($location, AuthService, AlertService) {
	var vm = this;

	vm.forgot = forgot;

	activate();

	function activate() {
		vm.disabled = false;
	}

	function forgot() {
		vm.disabled = true;

		AuthService.forgotPassword(vm.email)
		.then(function() {
			vm.disabled = false;
			vm.email = '';
			AlertService.success(
				'An email has been sent with further instructions'
			);
		}, function(error) {
			AlertService.error(error || 'Unknown error');
			vm.disabled = false;
			vm.email = '';
		});
	}
}

})();
