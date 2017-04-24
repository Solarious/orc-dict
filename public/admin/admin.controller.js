(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('AdminController', AdminController);

AdminController.$inject = ['$http', '$location', 'AlertService'];

function AdminController($http, $location, AlertService) {
	var vm = this;

	vm.csrftest = csrftest;
	vm.alertTest = alertTest;
	vm.successTest = successTest;
	vm.alertLinkTest = alertLinkTest;

	function csrftest() {
		console.log('Testing');
		$http.post('/api/csrftest')
		.then(function(response) {
			console.log(response.data);
		}, function(response) {
			console.log(response);
		});
	}

	function alertTest() {
		AlertService.error('WARNING!!!');
	}

	function successTest() {
		AlertService.success('SUCCESS!!!');
	}

	function alertLinkTest() {
		$location.path('/');
		AlertService.successDeferred('HUZZAH!!!');
	}
}

})();

