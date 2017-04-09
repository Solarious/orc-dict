(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('AdminController', AdminController);

AdminController.$inject = ['$http'];

function AdminController($http) {
	var vm = this;

	vm.csrftest = csrftest;

	function csrftest() {
		console.log('Testing');
		$http.post('/api/csrftest')
		.then(function(response) {
			console.log(response.data);
		}, function(response) {
			console.log(response);
		});
	}
}

})();

