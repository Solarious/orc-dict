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
		templateUrl: 'views/editableWord.directive.html',
		controller: EditableWordController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

function EditableWordController() {
	var vm = this;

	vm.toggleExamples = toggleExamples;
	vm.addExample = addExample;
	vm.removeExample = removeExample;
	vm.getNumExamples = getNumExamples;

	activate();

	function activate() {
		vm.toggleExamples();
	}

	function toggleExamples() {
		if (vm.showExamples === undefined || vm.showExamples) {
			vm.showExamples = false;
			vm.showExamplesText = 'Show Examples Section';
		} else {
			vm.showExamples = true;
			vm.showExamplesText = 'Hide Examples Section';
		}
	}

	function addExample() {
		vm.word.exampleSentences = vm.word.exampleSentences || [];
		vm.word.exampleSentences.push({
			orcish: '',
			english: ''
		});
	}

	function removeExample(index) {
		vm.word.exampleSentences.splice(index, 1);
	}

	function getNumExamples() {
		if (vm.word && vm.word.exampleSentences) {
			return vm.word.exampleSentences.length;
		} else {
			return 0;
		}
	}
}

})();
