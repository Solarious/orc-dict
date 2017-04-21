(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('AdminController', AdminController);

AdminController.$inject = ['$http', 'WordsService', '$location'];

function AdminController($http, WordsService, $location) {
	var vm = this;

	vm.csrftest = csrftest;
	vm.showRemoveModal = showRemoveModal;
	vm.removeModalAction = removeModalAction;

	activate();

	function activate() {
		return WordsService.get()
		.then(function(data) {
			vm.words = data;
			return vm.words;
		});
	}

	function csrftest() {
		console.log('Testing');
		$http.post('/api/csrftest')
		.then(function(response) {
			console.log(response.data);
		}, function(response) {
			console.log(response);
		});
	}

	function showRemoveModal(word) {
		vm.wordToRemove = word;
		$('#removeModal').modal('show');
	}

	function removeModalAction() {
		WordsService.remove(vm.wordToRemove.orcish)
		.then(function() {
			activate();
		});
		$('#removeModal').modal('hide');
	}
}

})();
