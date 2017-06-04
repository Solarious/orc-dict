(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableSentence', editableSentence);

function editableSentence() {
	var directive = {
		restrict: 'E',
		scope: {
			sentence: '=',
			submitFunction: '&',
			submitText: '@',
			submitDisabled: '=',
		},
		templateUrl: 'src/sentence/editableSentence.directive.html',
		controller: EditableSentenceController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

function EditableSentenceController() {
	var vm = this;

	vm.addWord = addWord;
	vm.removeWord = removeWord;

	activate();

	function activate() {
	}

	function addWord() {
		vm.sentence.words = vm.sentence.words || [];
		vm.sentence.words.push({
			orcish: '',
			num: 1
		});
	}

	function removeWord() {
	}
}

})();
