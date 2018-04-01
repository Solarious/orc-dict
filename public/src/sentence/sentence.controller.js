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
	vm.onPageChange = onPageChange;
	vm.onPageChangeWithScroll = onPageChangeWithScroll;
	vm.resetPageAndLoadSentences = resetPageAndLoadSentences;
	vm.showRemoveModal = showRemoveModal;
	vm.removeModalAction = removeModalAction;
	vm.showRemoveAllModal = showRemoveAllModal;
	vm.removeAllModalAction = removeAllModalAction;

	activate();

	function activate() {
		vm.numPerPage = '10';
		vm.page = 1;
		vm.numOfPages = 0;
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
			return vm.sentences;
		}, function(error) {
			AlertService.error(error || 'Unknown error loading sentences');
		});
	}

	function onPageChange(pageNum) {
		vm.page = pageNum;
		vm.loadSentences();
	}

	function onPageChangeWithScroll(pageNum) {
		vm.page = pageNum;
		vm.loadSentences();
		$('html, body').animate({
			scrollTop: $('#target').offset().top - 50
		});
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

	function showRemoveAllModal() {
		$('#removeAllModal').modal('show');
	}

	function removeAllModalAction() {
		SentencesService.removeAll()
		.then(function(response) {
			var num = response.n;
			var str = (num === 1) ? ' word removed' : ' words removed';
			AlertService.success(num + str);
			vm.loadSentences();
		})
		.catch(function(error) {
			AlertService.success(error || 'Unknown error removing sentences');
		});
		$('#removeAllModal').modal('hide');
	}
}

})();
