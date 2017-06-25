(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableWord', editableWord);

function editableWord() {
	var directive = {
		restrict: 'E',
		scope: {
			word: '=',
			submitFunction: '&',
			submitText: '@',
			submitDisabled: '=',
			autofillFunction: '&'
		},
		templateUrl: 'src/editable/editableWord.directive.html',
		controller: EditableWordController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

function EditableWordController() {
	var vm = this;

	vm.canAutofill = canAutofill;
	vm.showHelpModal = showHelpModal;
	vm.onChangeOrcish = onChangeOrcish;
	vm.autofill = autofill;

	function canAutofill() {
		var PoS = vm.word.PoS;
		return (
			PoS === 'adjective' ||
			PoS === 'noun' ||
			PoS === 'verb'
		);
	}

	function showHelpModal() {
		$('#helpModal').modal('show');
	}

	function onChangeOrcish() {
		vm.showForgetMessage = (
			(vm.word.PoS === 'noun' && vm.word.noun &&
			vm.word.noun.declension !== 'irregular') ||
			(vm.word.PoS === 'adjective' && vm.word.adjective) ||
			(vm.word.PoS === 'verb' && vm.word.verb)
		);
	}

	function autofill() {
		vm.showForgetMessage = false;
		vm.autofillFunction();
	}
}

})();
