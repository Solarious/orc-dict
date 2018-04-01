(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictWordsTable', wordsTable);

function wordsTable() {
	var directive = {
		restrict: 'E',
		scope: {
			isAdmin: '@'
		},
		templateUrl: 'src/shared/wordsTable.directive.html',
		controller: WordsTableController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

WordsTableController.$inject = ['WordsService', 'AlertService'];

function WordsTableController(WordsService, AlertService) {
	var vm = this;

	vm.loadWords = loadWords;
	vm.onPageChange = onPageChange;
	vm.onPageChangeWithScroll = onPageChangeWithScroll;
	vm.showRemoveModal = showRemoveModal;
	vm.removeModalAction = removeModalAction;
	vm.resetPageAndLoadWords = resetPageAndLoadWords;

	activate();

	function activate() {
		vm.numPerPage = "50";
		vm.page = 1;
		vm.numOfPages = 0;
		vm.order = 'orcish';

		vm.PoS = "";
		vm.declension = "";
		vm.conjugation = "";
		vm.pronounType = "";

		vm.loadWords();
	}

	function loadWords() {
		var options = {
			sort: vm.order,
			limit: vm.numPerPage,
			skip: vm.numPerPage * (vm.page - 1),
			getcount: true
		};
		if (vm.PoS) {
			options.pos = vm.PoS;
		}
		if (vm.PoS === 'noun' && vm.declension) {
			options.declension = vm.declension;
		}
		if (vm.PoS === 'verb' && vm.conjugation) {
			options.conjugation = vm.conjugation;
		}
		if (vm.PoS === 'pronoun' && vm.pronounType) {
			options.pronountype = vm.pronounType;
		}

		return WordsService.list(options)
		.then(function(data) {
			vm.words = data.words;
			vm.numOfPages = Math.ceil(data.count / vm.numPerPage);
			return vm.words;
		}, function(error) {
			AlertService.error(error || 'Unknown error loading words');
		});
	}

	function onPageChange(num) {
		vm.page = num;
		loadWords();
	}

	function onPageChangeWithScroll(num) {
		vm.page = num;
		loadWords();
		$('html, body').animate({
			scrollTop: $('#target').offset().top - 50
		});
	}

	function showRemoveModal(word) {
		vm.wordToRemove = word;
		$('#removeModal').modal('show');
	}

	function removeModalAction() {
		WordsService.remove(vm.wordToRemove.orcish, vm.wordToRemove.num)
		.then(function(word) {
			vm.loadWords();
			var w = [word.orcish, word.PoS, word.english].join(', ');
			AlertService.success('Word "' + w + '" removed');
		}, function(error) {
			AlertService.error(error || 'Unknown error removing word');
		});
		$('#removeModal').modal('hide');
	}

	function resetPageAndLoadWords() {
		vm.page = 1;
		vm.loadWords();
	}
}

})();
