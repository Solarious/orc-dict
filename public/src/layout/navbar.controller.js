(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('NavbarController', NavbarController);

NavbarController.$inject = [
	'AuthService', '$location', 'AlertService', '$route'
];

function NavbarController(AuthService, $location, AlertService, $route) {
	var vm = this;

	vm.isLoggedIn = isLoggedIn;
	vm.getUserName = getUserName;
	vm.logout = logout;
	vm.search = search;

	activate();

	function activate() {
		vm.searchText = $location.search().q;
	}

	function isLoggedIn() {
		return AuthService.isLoggedIn();
	}

	function getUserName() {
		return AuthService.getUserName();
	}

	function logout() {
		AuthService.logout()
		.then(function() {
			if ($location.path() === '/') {
				AlertService.success('Logged out');
			} else {
				AlertService.successDeferred('Logged out');
			}
			$location.path('/');
		});
	}

	function search() {
		if (vm.searchText) {
			$location.path('/search')
			.search({
				q: vm.searchText
			});
			$route.reload();
		}
	}
}

})();
