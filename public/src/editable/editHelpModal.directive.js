(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditHelpModal', editHelpModal);

function editHelpModal() {
	var directive = {
		restrict: 'E',
		scope: {
			modalId: '@'
		},
		templateUrl: 'src/editable/editHelpModal.directive.html',
		controller: EditHelpModalController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

EditHelpModalController.$inject = ['$location'];

function EditHelpModalController($location) {
	var vm = this;

	vm.getHost = getHost;

	function getHost() {
		return $location.host();
	}
}

})();
