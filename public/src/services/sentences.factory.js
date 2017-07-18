(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('SentencesService', sentencesService);

sentencesService.$inject = ['$http', '$q'];

function sentencesService($http, $q) {
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

	function get(id) {
		return $http.get('/api/sentences/' + id)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function list(options) {
		return $http.get('/api/sentences', {
			params: options
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function create(sentence) {
		return $http.post('/api/sentences', sentence)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function update(id, sentence) {
		return $http.put('/api/sentences/' + id, sentence)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function remove(id) {
		return $http.delete('/api/sentences/' + id)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function bulkAdd(data) {
		return $http.post('/api/bulkaddsentences', {
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
		return $http.delete('/api/allsentences')
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}
}

})();
