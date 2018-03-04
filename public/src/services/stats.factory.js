(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('StatsService', statsService);

statsService.$inject = ['$http', '$q'];

function statsService($http, $q) {
	var service = {
		get: get,
		setNeedsUpdate: setNeedsUpdate
	};

	return service;

	function get() {
		return $http.get('/api/stats')
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function setNeedsUpdate() {
		return $http.post('/api/stats/set-needs-update')
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}
}

})();
