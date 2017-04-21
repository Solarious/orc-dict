(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('SearchController', SearchController);

SearchController.$inject = ['WordsService', '$location'];

function SearchController(WordsService, $location) {
	var vm = this;

	activate();

	vm.setActive = setActive;

	function activate() {
		WordsService.search($location.search().q)
		.then(function(data) {
			vm.results = data.results;
			setActive(0);
		}, function(error) {
			vm.errorMessage = error;
		});
	}

	function setActive(index) {
		vm.activeResult = index;
		vm.activeMatches = vm.results[vm.activeResult].matches;
	}
}

})();
