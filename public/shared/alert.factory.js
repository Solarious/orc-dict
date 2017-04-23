(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('AlertService', alertService);

alertService.$inject = ['$q', '$timeout', '$http'];

function alertService($q, $timeout, $http) {
	var alerts = [];
	var deferredAlerts = [];

	var service = {
		error: error,
		success: success,
		errorDeferred: errorDeferred,
		successDeferred: successDeferred,
		close: close,
		get: get,
		clear: clear,
	};

	return service;

	function error(message) {
		alerts.unshift({
			message: message,
			header: 'Error!',
			type: 'danger'
		});
	}

	function success(message) {
		alerts.unshift({
			message: message,
			header: 'Success!',
			type: 'success'
		});
	}

	function errorDeferred(message) {
		deferredAlerts.unshift({
			message: message,
			header: 'Error!',
			type: 'danger'
		});
	}

	function successDeferred(message) {
		deferredAlerts.unshift({
			message: message,
			header: 'Success!',
			type: 'success'
		});
	}

	function close(index) {
		alerts.splice(index, 1);
	}

	function get() {
		return alerts;
	}

	function clear() {
		while (alerts.length > 0) {
			alerts.pop();
		}

		while (deferredAlerts.length > 0) {
			alerts.push(deferredAlerts.pop());
		}
	}
}

})();
