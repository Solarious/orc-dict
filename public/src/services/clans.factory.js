(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('ClansService', clansService);

clansService.$inject = ['$http', '$q'];

function clansService($http, $q) {
	var service = {
		get: get,
		list: list,
		create: create,
		update: update,
		remove: remove,
		bulkAdd: bulkAdd,
		removeAll: removeAll
	};

	return service;

	function get(name) {
		return $http.get('/api/clans/' + name)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function list(options) {
		return $http.get('/api/clans', {
			params: options
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function create(clan) {
		return $http.post('/api/clans', clan)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function update(name, clan) {
		return $http.put('/api/clans/' + name, clan)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function remove(name) {
		return $http.delete('/api/clans/' + name)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function bulkAdd(data) {
		return $http.post('/api/bulkaddclans', {
			data: data
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function removeAll() {
		return $http.delete('/api/allclans')
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}
}

})();
