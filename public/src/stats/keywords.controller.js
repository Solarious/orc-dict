(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('KeywordsController', KeywordsController);

KeywordsController.$inject = ['StatsService', 'AlertService'];

function KeywordsController(StatsService, AlertService) {
	var vm = this;

	activate();

	vm.reloadStats = reloadStats;
	vm.setActive = setActive;

	function activate() {
		vm.sortBy = '0';
		vm.fromTo = '0 10';
		reloadStats();
	}

	function reloadStats() {
		vm.keywords = null;
		var ft = vm.fromTo.split(' ');
		vm.from = Number(ft[0]);
		vm.to = Number(ft[1]);
		StatsService.keywords(vm.sortBy, vm.from, vm.to)
		.then(function(keywords) {
			vm.keywords = keywords.data;
			setActive(0);
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error getting statistics');
		});
	}

	function setActive(index) {
		vm.activeKeyword = index;
		vm.activeData = vm.keywords[index];
	}
}

})();
