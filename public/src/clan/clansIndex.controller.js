(function() {
'use strict';

angular.
	module('orcDictApp').
	controller('ClansIndexController', ClansIndexController);

ClansIndexController.$inject = [
	'ClansService',
	'AlertService',
	'AuthService'
];

function ClansIndexController(ClansService, AlertService, AuthService) {
	var vm = this;

	vm.isLoggedIn = isLoggedIn;
	vm.loadClans = loadClans;
	vm.changePage = changePage;
	vm.goBack = goBack;
	vm.goForward = goForward;
	vm.resetPageAndLoadClans = resetPageAndLoadClans;
	vm.showRemoveModal = showRemoveModal;
	vm.removeModalAction = removeModalAction;
	vm.showRemoveAllModal = showRemoveAllModal;
	vm.removeAllModalAction = removeAllModalAction;

	activate();

	function activate() {
		vm.numPerPage = '10';
		vm.page = 1;
		vm.numOfPages = 0;
		vm.nums = [];
		vm.goBackDisabled = true;
		vm.goForwardDisabled = true;

		vm.loadClans();
	}

	function isLoggedIn() {
		return AuthService.isLoggedIn();
	}

	function loadClans() {
		var options = {
			limit: vm.numPerPage,
			skip: vm.numPerPage * (vm.page - 1),
			getcount: true,
		};

		return ClansService.list(options)
		.then(function(data) {
			vm.clans = data.clans;
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

			return vm.clans;
		}, function(error) {
			AlertService.error(error || 'Unknown error loading clans');
		});
	}

	function changePage(pageNum) {
		vm.page = pageNum;
		vm.loadClans();
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

	function resetPageAndLoadClans() {
		vm.page = 1;
		vm.loadClans();
	}

	function showRemoveModal(clan) {
		vm.clanToRemove = clan;
		$('#removeModal').modal('show');
	}

	function removeModalAction() {
		ClansService.remove(vm.clanToRemove.name)
		.then(function(clan) {
			vm.loadClans();
			AlertService.success('Clan removed: ' + clan.name);
		}, function(error) {
			AlertService.error(error || 'Unknown error removing clan');
		});
		$('#removeModal').modal('hide');
	}

	function showRemoveAllModal() {
		$('#removeAllModal').modal('show');
	}

	function removeAllModalAction() {
		ClansService.removeAll()
		.then(function(response) {
			var num = response.n;
			var str = (num === 1) ? ' clan removed' : ' clans removed';
			AlertService.success(num + str);
			vm.loadClans();
		})
		.catch(function(error) {
			AlertService.success(error || 'Unknown error removing clans');
		});
		$('#removeAllModal').modal('hide');
	}
}

})();
