(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('SearchController', SearchController);

SearchController.$inject = ['WordsService', '$location', 'AlertService'];

function SearchController(WordsService, $location, AlertService) {
	var vm = this;

	activate();

	vm.setActive = setActive;

	function activate() {
		WordsService.search($location.search().q)
		.then(function(data) {
			vm.results = data.results;
			setActive(0);
		}, function(error) {
			AlertService.error(error);
		});
	}

	function setActive(index) {
		vm.activeResult = index;
		vm.activeMatches = vm.results[vm.activeResult].matches;
	}
}

})();
