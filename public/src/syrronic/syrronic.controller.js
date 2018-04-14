(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('SyrronicController', SyrronicController);

SyrronicController.$inject = [];

function SyrronicController() {
	var vm = this;

	activate();

	function activate() {
		vm.align = 'left';
		vm.size = 1;
	}
}

})();
