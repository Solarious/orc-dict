(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictPagnation', pagnation);

pagnation.$inject = ['$window', '$timeout'];

function pagnation($window, $timeout) {
	var directive = {
		restrict: 'E',
		scope: {
			page: '=',
			numOfPages: '=',
			onPageChange: '&',
			maxBoxes: '=',
		},
		templateUrl: 'src/shared/pagnation.directive.html',
		controller: PagnationController,
		controllerAs: 'vm',
		bindToController: true,
		link: link
	};

	return directive;

	function link(scope, element, attrs, ctrl) {
		scope.$watch('vm.page', function(o, n) {
			resizeTwice();
		});
		scope.$watch('vm.numOfPages', function(o, n) {
			resizeTwice();
		});

		angular.element($window).on('resize', onResize);

		element.on('$destroy', function() {
			angular.element($window).off('resize', onResize);
		});

		ctrl.updateNums();
		resizeTwice();

		function resize() {
			var navWidth = element.find('nav').outerWidth();
			var aElements = element.find('a');
			var boxWidth = aElements.outerWidth() * 1.2;
			aElements.each(function() {
				boxWidth = Math.max(boxWidth, $(this).outerWidth() * 1.1);
			});
			var maxFit = Math.floor(navWidth / boxWidth);
			if (maxFit % 2 === 0) maxFit--;
			if (ctrl.maxBoxes && (maxFit > ctrl.maxBoxes)) {
				maxFit = ctrl.maxBoxes;
			}
			if (maxFit < 5) maxFit = 5;
			ctrl.maxFit = maxFit;
			ctrl.updateNums();
		}

		function onResize() {
			scope.$apply(function() {
				resize();
			});
		}

		function resizeTwice() {
			resize();

			$timeout(function() {
				resize();
			});
		}
	}
}


PagnationController.$inject = ['$scope'];

function PagnationController($scope) {
	var vm = this;

	vm.updateNums = updateNums;
	vm.changePage = changePage;
	vm.goBack = goBack;
	vm.goForward = goForward;
	vm.backDisabled = backDisabled;
	vm.forwardDisabled = forwardDisabled;

	function updateNums() {
		vm.nums = [];

		var startPage = 1;
		var endPage = vm.numOfPages;
		var maxLen = (vm.maxFit || vm.maxBoxes) - 4;

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

	function changePage(pageNum) {
		if (pageNum > vm.numOfPages) pageNum = vm.numOfPages;
		if (pageNum < 1) pageNum = 1;

		vm.page = pageNum;
		vm.onPageChange({ num: pageNum });
	}

	function goBack() {
		if (!backDisabled()) changePage(vm.page - 1);
	}

	function goForward() {
		if (!forwardDisabled()) changePage(vm.page + 1);
	}

	function backDisabled() {
		return vm.page <= 1;
	}

	function forwardDisabled() {
		return vm.page >= vm.numOfPages;
	}
}

})();
