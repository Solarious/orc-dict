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
	vm.onPageChange = onPageChange;
	vm.onPageChangeWithScroll = onPageChangeWithScroll;
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
			return vm.clans;
		}, function(error) {
			AlertService.error(error || 'Unknown error loading clans');
		});
	}

	function onPageChange(pageNum) {
		vm.page = pageNum;
		vm.loadClans();
	}

	function onPageChangeWithScroll(pageNum) {
		vm.page = pageNum;
		vm.loadClans();
		$('html, body').animate({
			scrollTop: $('#target').offset().top - 50
		});
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
