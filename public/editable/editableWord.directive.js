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
		templateUrl: 'editable/editableWord.directive.html',
		controller: EditableWordController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

function EditableWordController() {
	var vm = this;

	vm.toggleExamples = toggleExamples;
	vm.toggleRelatedWords = toggleRelatedWords;
	vm.addExample = addExample;
	vm.addRelatedWord = addRelatedWord;
	vm.removeExample = removeExample;
	vm.removeRelatedWord = removeRelatedWord;
	vm.getNumExamples = getNumExamples;
	vm.getNumRelatedWords = getNumRelatedWords;

	activate();

	function activate() {
		vm.toggleExamples();
		vm.toggleRelatedWords();
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

	function toggleRelatedWords() {
		if (vm.showRelatedWords === undefined || vm.showRelatedWords) {
			vm.showRelatedWords = false;
			vm.showRelatedWordsText = 'Show Related Words Section';
		} else {
			vm.showRelatedWords = true;
			vm.showRelatedWordsText = 'Hide Related Words Section';
		}
	}

	function addExample() {
		vm.word.exampleSentences = vm.word.exampleSentences || [];
		vm.word.exampleSentences.push({
			orcish: '',
			english: ''
		});
	}

	function addRelatedWord() {
		vm.word.relatedWords = vm.word.relatedWords || [];
		vm.word.relatedWords.push({
			orcish: ''
		});
	}

	function removeExample(index) {
		vm.word.exampleSentences.splice(index, 1);
	}

	function removeRelatedWord(index) {
		vm.word.relatedWords.splice(index, 1);
	}

	function getNumExamples() {
		if (vm.word && vm.word.exampleSentences) {
			return vm.word.exampleSentences.length;
		} else {
			return 0;
		}
	}

	function getNumRelatedWords() {
		if (vm.word && vm.word.relatedWords) {
			return vm.word.relatedWords.length;
		} else {
			return 0;
		}
	}
}

})();
