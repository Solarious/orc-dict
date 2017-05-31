(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('StatsController', StatsController);

StatsController.$inject = ['WordsService', 'AlertService'];

function StatsController(WordsService, AlertService) {
	var vm = this;

	activate();

	function activate() {
		WordsService.stats()
		.then(function(stats) {
			vm.stats = stats;
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error getting statistics');
		});
	}
}

})();
