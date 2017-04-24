(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictWordsTable', wordsTable);

function wordsTable() {
	var directive = {
		restrict: 'E',
		scope: {
			isAdmin: '@',
			removeAction: '&'
		},
		templateUrl: 'shared/wordsTable.directive.html',
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

	activate();

	function activate() {
		vm.numPerPage = "10";
		vm.page = 1;
		vm.numOfPages = 0;
		vm.nums = [];
		vm.goBackDisabled = false;
		vm.goForwardDisabled = false;

		vm.loadWords();
	}

	function loadWords() {
		return WordsService.list({
			sort: 'orcish',
			limit: vm.numPerPage,
			skip: vm.numPerPage * (vm.page - 1),
			getcount: true
		})
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
		WordsService.remove(vm.wordToRemove.orcish)
		.then(function() {
			vm.loadWords();
		});
		$('#removeModal').modal('hide');
	}
}

})();
