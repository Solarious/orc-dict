(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('SearchController', SearchController);

SearchController.$inject = ['SearchService', '$location', 'AlertService'];

function SearchController(SearchService, $location, AlertService) {
	var vm = this;

	activate();

	vm.setActive = setActive;

	function activate() {
		SearchService.search($location.search().q)
		.then(function(data) {
			vm.results = data.results;
			vm.textResults = data.textResults;
			setActive(0);
		}, function(error) {
			AlertService.error(error || 'Unknown error with search');
		});
	}

	function setActive(index) {
		vm.activeResult = index;
		vm.activeMatches = vm.results[vm.activeResult].matches;
	}
}

})();
