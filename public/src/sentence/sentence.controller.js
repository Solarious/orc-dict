(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('SentenceController', SentenceController);

SentenceController.$inject = [
	'SentencesService',
	'AlertService',
	'AuthService'
];

function SentenceController(SentencesService, AlertService, AuthService) {
	var vm = this;

	vm.isLoggedIn = isLoggedIn;
	vm.loadSentences = loadSentences;
	vm.changePage = changePage;
	vm.goBack = goBack;
	vm.goForward = goForward;
	vm.resetPageAndLoadSentences = resetPageAndLoadSentences;
	vm.showRemoveModal = showRemoveModal;
	vm.removeModalAction = removeModalAction;

	activate();

	function activate() {
		vm.numPerPage = '10';
		vm.page = 1;
		vm.numOfPages = 0;
		vm.nums = [];
		vm.goBackDisabled = true;
		vm.goForwardDisabled = true;
		vm.category = '';
		vm.categories = [];

		vm.loadSentences();
	}

	function isLoggedIn() {
		return AuthService.isLoggedIn();
	}

	function loadSentences() {
		var options = {
			sort: 'category',
			limit: vm.numPerPage,
			skip: vm.numPerPage * (vm.page - 1),
			getcount: true,
			getcategories: true
		};
		if (vm.category !== '') {
			options.category = vm.category;
		}

		return SentencesService.list(options)
		.then(function(data) {
			vm.sentences = data.sentences;
			vm.categories = data.categories;
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

			return vm.sentences;
		}, function(error) {
			AlertService.error(error || 'Unknown error loading sentences');
		});
	}

	function changePage(pageNum) {
		vm.page = pageNum;
		vm.loadSentences();
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

	function resetPageAndLoadSentences() {
		vm.page = 1;
		vm.loadSentences();
	}

	function showRemoveModal(sentence) {
		vm.sentenceToRemove = sentence;
		$('#removeModal').modal('show');
	}

	function removeModalAction() {
		SentencesService.remove(vm.sentenceToRemove._id)
		.then(function() {
			vm.loadSentences();
		}, function(error) {
			AlertService.error(error || 'Unknown error removing sentence');
		});
		$('#removeModal').modal('hide');
	}
}

})();