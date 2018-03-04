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
			vm.adjTypes = calcAdjTypes();
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error getting statistics');
		});
	}

	function calcAdjTypes() {
		var adjTypes = [];
		var types = vm.stats.adjective.types;

		for (var key in types) {
			if (types.hasOwnProperty(key) && key != 'irregular') {
				adjTypes.push([key, types[key]]);
			}
		}

		adjTypes.sort(function(a, b) {
			if (a[0] < b[0]) return -1;
			if (a[0] > b[0]) return 1;
			return 0;
		});

		return adjTypes;
	}
}

})();
