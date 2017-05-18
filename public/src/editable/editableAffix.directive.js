(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableAffix', editableAffix);

function editableAffix() {
	var directive = {
		restrict: 'E',
		scope: {
			affix: '='
		},
		templateUrl: 'src/editable/editableAffix.directive.html',
		controller: EditableAffixController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

function EditableAffixController() {
	var vm = this;

	vm.addLimit = addLimit;
	vm.removeLimit = removeLimit;

	function addLimit() {
		vm.affix = vm.affix || {};
		vm.affix.limits = vm.affix.limits || [];
		vm.affix.limits.push({
			PoS: ''
		});
	}

	function removeLimit(index) {
		vm.affix.limits.splice(index, 1);
	}
}

})();
