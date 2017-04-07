(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('RootController', RootController);

RootController.$inject = ['AuthService', '$location'];

function RootController(AuthService, $location) {
	var vm = this;

	vm.isLoggedIn = isLoggedIn;
	vm.getUserName = getUserName;
	vm.logout = logout;

	function isLoggedIn() {
		return AuthService.isLoggedIn();
	}

	function getUserName() {
		return AuthService.getUserName();
	}

	function logout() {
		AuthService.logout()
		.then(function() {
			$location.path('/');
		});
	}
}

})();
