(function() {
'use strict';

angular.
	module('orcDictApp').
	run(run);

run.$inject = ['$rootScope', '$location', '$route', 'AuthService'];

function run($rootScope, $location, $route, AuthService) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		AuthService.getUserStatus()
		.then(function() {
			if (next.restricted && AuthService.isLoggedIn() === false) {
				$location.path('/login');
				$route.reload();
			}
		});
	});
}

})();

