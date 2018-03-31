(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictEditableClan', editableClan);

function editableClan() {
	var directive = {
		restrict: 'E',
		scope: {
			clan: '=',
			submitFunction: '&',
			submitText: '@',
			submitDisabled: '='
		},
		templateUrl: 'src/clan/editable/editableClan.html',
		controller: EditableClanController,
		controllerAs: 'vm',
		bindToController: true
	};

	return directive;
}

function EditableClanController() {
	var vm = this;

	vm.clean = clean;

	function clean() {
		cleanProperty('history');
		cleanProperty('customs');
		cleanProperty('relations');
		vm.clan.shortDesc = cleanEntry(vm.clan.shortDesc);
	}

	function cleanProperty(prop) {
		var newProp = [];
		for (var i = 0; i < vm.clan[prop].length; i++) {
			newProp.push(cleanEntry(vm.clan[prop][i]));
		}
		vm.clan[prop] = newProp;
	}

	function cleanEntry(entry) {
		entry = entry.replace('-\n', '');
		entry = entry.replace('\n', ' ');
		return entry;
	}
}

})();
