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
	vm.changePage = changePage;
	vm.goBack = goBack;
	vm.goForward = goForward;
	vm.showRemoveModal = showRemoveModal;
	vm.removeModalAction = removeModalAction;
	vm.resetPageAndLoadWords = resetPageAndLoadWords;

	activate();

	function activate() {
		vm.numPerPage = "50";
		vm.page = 1;
		vm.numOfPages = 0;
		vm.nums = [];
		vm.goBackDisabled = false;
		vm.goForwardDisabled = false;
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
		if (vm.declension) {
			options.declension = vm.declension;
		}
		if (vm.conjugation) {
			options.conjugation = vm.conjugation;
		}
		if (vm.pronounType) {
			options.pronountype = vm.pronounType;
		}

		return WordsService.list(options)
		.then(function(data) {
			vm.words = data.words;
			vm.numOfPages = Math.ceil(data.count / vm.numPerPage);
			vm.goBackDisabled = (vm.page <= 1);
			vm.goForwardDisabled = (vm.page >= vm.numOfPages);
			vm.nums = [];
			for (var i = 1; i <= vm.numOfPages; i++) {
				vm.nums.push({
					num: i,
					selected: (i === vm.page)
				});
			}
			return vm.words;
		}, function(error) {
			AlertService.error(error || 'Unknown error loading words');
		});
	}

	function changePage(pageNum) {
		vm.page = pageNum;
		vm.loadWords();
	}

	function goBack() {
		if (!vm.goBackDisabled) {
			vm.changePage(vm.page - 1);
		}
	}

	function goForward() {
		if (!vm.goForwardDisabled) {
			vm.changePage(vm.page + 1);
		}
	}

	function showRemoveModal(word) {
		vm.wordToRemove = word;
		$('#removeModal').modal('show');
	}

	function removeModalAction() {
		WordsService.remove(vm.wordToRemove.orcish, vm.wordToRemove.num)
		.then(function() {
			vm.loadWords();
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
