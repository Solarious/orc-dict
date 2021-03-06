(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictAlerts', alerts);

function alerts() {
	var directive = {
		restrict: 'E',
		templateUrl: 'src/alert/alerts.directive.html',
		controller: AlertsController,
		controllerAs: 'vm',
		bindToController: true,
		scope: true
	};

	return directive;
}

AlertsController.$inject = ['AlertService'];

function AlertsController(AlertService) {
	var vm = this;

	activate();

	vm.closeAlert = closeAlert;

	function activate() {
		vm.alerts = AlertService.get();
	}

	function closeAlert(index) {
		AlertService.close(index);
	}
}

})();
