(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('SyrronicService', syrronicService);

syrronicService.$inject = [];

function syrronicService() {
	var convert = false;

	var service = {
		getConvert: getConvert,
		setConvert: setConvert,
		toggleConvert: toggleConvert
	};

	return service;

	function getConvert() {
		return convert;
	}

	function setConvert(value) {
		convert = value;
	}

	function toggleConvert() {
		convert = !convert;
	}
}

})();
