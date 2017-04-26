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
	vm.toggleKeywords = toggleKeywords;
	vm.addExample = addExample;
	vm.addRelatedWord = addRelatedWord;
	vm.addKeyword = addKeyword;
	vm.removeExample = removeExample;
	vm.removeRelatedWord = removeRelatedWord;
	vm.removeKeyword = removeKeyword;
	vm.getNumExamples = getNumExamples;
	vm.getNumRelatedWords = getNumRelatedWords;
	vm.getNumKeywords = getNumKeywords;
	vm.canAutofill = canAutofill;

	activate();

	function activate() {
		vm.toggleExamples();
		vm.toggleRelatedWords();
		vm.toggleKeywords();
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

	function toggleKeywords() {
		if (vm.showKeywords === undefined || vm.showKeywords) {
			vm.showKeywords = false;
			vm.showKeywordsText = 'Show Keywords Section';
		} else {
			vm.showKeywords = true;
			vm.showKeywordsText = 'Hide Keywords Section';
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

	function addKeyword() {
		vm.word.keywords = vm.word.keywords || [];
		vm.word.keywords.push({
			keyword: '',
			priority: 3,
			message: ''
		});
	}

	function removeExample(index) {
		vm.word.exampleSentences.splice(index, 1);
	}

	function removeRelatedWord(index) {
		vm.word.relatedWords.splice(index, 1);
	}

	function removeKeyword(index) {
		vm.word.keywords.splice(index, 1);
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

	function getNumKeywords() {
		if (vm.word && vm.word.keywords) {
			return vm.word.keywords.length;
		} else {
			return 0;
		}
	}

	function canAutofill() {
		var PoS = vm.word.PoS;
		return (
			PoS === 'adjective' ||
			PoS === 'noun' ||
			PoS === 'verb'
		);
	}
}

})();
