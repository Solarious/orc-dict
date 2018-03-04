(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('StatsController', StatsController);

StatsController.$inject = ['StatsService', 'AlertService'];

function StatsController(StatsService, AlertService) {
	var vm = this;

	activate();

	function activate() {
		StatsService.get()
		.then(function(stats) {
			vm.stats = stats;
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error getting statistics');
		});
	}
}

})();
