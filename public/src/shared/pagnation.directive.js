(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictPagnation', pagnation);

function pagnation() {
	var directive = {
		restrict: 'E',
		scope: {
			page: '=',
			numOfPages: '=',
			changePage: '&',
			goBack: '&',
			goForward: '&',
			goBackDisabled: '=',
			goForwardDisabled: '=',
			maxBoxes: '='
		},
		templateUrl: 'src/shared/pagnation.directive.html',
		controller: PagnationController,
		controllerAs: 'vm',
		bindToController: true,
		link: link
	};

	return directive;
}

function link(scope, element, attrs, ctrl) {
	scope.$watch('vm.page', function(o, n) {
		ctrl.updateNums();
	});
	scope.$watch('vm.numOfPages', function(o, n) {
		ctrl.updateNums();
	});
}

PagnationController.$inject = ['$scope'];

function PagnationController($scope) {
	var vm = this;

	vm.overflowing = overflowing;
	vm.updateNums = updateNums;

	activate();

	function activate() {
	}

	function overflowing() {
		return (vm.nums.length >= vm.overflowAt);
	}

	function updateNums() {
		vm.nums = [];

		var startPage = 1;
		var endPage = vm.numOfPages;
		var maxLen = vm.maxBoxes - 4;

		function calc() {
			if (maxLen < vm.numOfPages) {
				startPage = Math.max(1, vm.page - Math.floor(maxLen / 2));
				endPage = startPage + maxLen - 1;
				if (endPage > vm.numOfPages) {
					endPage = vm.numOfPages;
					startPage = endPage - maxLen + 1;
				}
			}
		}

		calc();
		var add = 4;
		if (startPage > 1) {
			add--;
			if (startPage !== 2) add--;
			else add++;
		}
		if (endPage < vm.numOfPages) {
			add--;
			if (endPage !== vm.numOfPages - 1) add--;
			else add++;
		}
		if (add) {
			maxLen += add;
			calc();
		}

		for (var i = startPage; i <= endPage; i++) {
			vm.nums.push({ num: i, sel: (i === vm.page), go: i });
		}

		if (startPage > 1) {
			if (startPage === 3) {
				vm.nums.unshift({ num: 2, sel: false, go: 2 });
			} else if (startPage !== 2) {
				vm.nums.unshift({
					num: '...', sel: false , go: startPage - 1
				});
			}
			vm.nums.unshift({ num: 1, sel: false, go: 1 });
		}

		if (endPage < vm.numOfPages) {
			if (endPage === vm.numOfPages - 2) {
				vm.nums.push({
					num: vm.numOfPages - 1, sel: false, go: vm.numOfPages - 1
				});
			} else if (endPage !== vm.numOfPages - 1) {
				vm.nums.push({ num: '...', sel: false, go: endPage + 1 });
			}
			vm.nums.push({
				num: vm.numOfPages, sel: false, go: vm.numOfPages
			});
		}
	}
}

})();
