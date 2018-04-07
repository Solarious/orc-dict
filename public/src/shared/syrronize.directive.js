(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictSyrronize', syrronize);

function syrronize() {
	var directive = {
		restrict: 'E',
		scope: {
			text: '=',
			raw: '@',
			onGlobal: '@',
			size: '@'
		},
		templateUrl: 'src/shared/syrronize.directive.html',
		controller: SyrronizeController,
		controllerAs: 'vm',
		bindToController: true

	};

	return directive;
}

SyrronizeController.$inject = ['SyrronicService'];

function SyrronizeController(SyrronicService) {
	var vm = this;

	vm.convert = convert;
	vm.show = show;
	vm.getSize = getSize;

	function convert() {
		return SyrronicService.getConvert();
	}

	function show() {
		return ((!vm.onGlobal) || convert());
	}

	function getSize() {
		return (vm.size || 1) + 'em';
	}
}

})();
