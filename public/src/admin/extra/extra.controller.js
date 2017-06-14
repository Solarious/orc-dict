(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('ExtraController', ExtraController);

ExtraController.$inject = ['WordsService', 'SearchService', 'AlertService'];

function ExtraController(WordsService, SearchService, AlertService) {
	var vm = this;

	vm.showRemoveAllModal = showRemoveAllModal;
	vm.removeAllModalAction = removeAllModalAction;
	vm.showRebuildModal = showRebuildModal;
	vm.rebuildModalAction = rebuildModalAction;
	vm.getCorrectArticle = getCorrectArticle;
	vm.getFormattedPoS = getFormattedPoS;

	activate();

	function activate() {
		vm.PoS = 'all';
	}

	function showRemoveAllModal() {
		$('#removeAllModal').modal('show');
	}

	function removeAllModalAction() {
		WordsService.removeByPoS(vm.PoS)
		.then(function(response) {
			var num = response.n;
			var str = (num === 1) ? ' word removed' : ' words removed';
			AlertService.success(num + str);
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error removing words');
		});
		$('#removeAllModal').modal('hide');
	}

	function showRebuildModal() {
		$('#rebuildModal').modal('show');
	}

	function rebuildModalAction() {
		SearchService.rebuild(vm.PoS)
		.then(function(response) {
			AlertService.success(response);
		})
		.catch(function(error) {
			AlertService.error(error || 'Unknown error starting rebuild');
		});
		$('#rebuildModal').modal('hide');
	}

	function getCorrectArticle() {
		if (['a', 'e', 'i', 'o', 'u'].indexOf(vm.PoS[0]) !== -1) {
			return 'an';
		} else {
			return 'a';
		}
	}

	function getFormattedPoS() {
		if (vm.PoS === 'copula') {
			return 'Copular Verb';
		} else if (vm.PoS === '') {
			return '';
		}
		else {
			return vm.PoS.slice(0, 1).toUpperCase() + vm.PoS.slice(1);
		}
	}
}

})();
