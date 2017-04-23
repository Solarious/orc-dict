(function() {
'use strict';

angular.
	module('orcDictApp').
	run(run);

run.$inject = ['$rootScope', '$location', '$route', 'AuthService',
'AlertService'];

function run($rootScope, $location, $route, AuthService, AlertService) {
	$rootScope.$on('$routeChangeStart', function(angularEvent, next, current) {
		AlertService.clear();
		AuthService.getUserStatus()
		.then(function() {
			if (next.restricted && AuthService.isLoggedIn() === false) {
				$location.path('/login');
				$route.reload();
			}
		});
	});

	$rootScope.$on('$routeChangeError',
	function(angularEvent, next, current, rejection) {
		AlertService.error(rejection.message);
	});
}

})();

