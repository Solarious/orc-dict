(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('WordsService', wordsService);

wordsService.$inject = ['$http', '$q'];

function wordsService($http, $q) {
	var service = {
		get: get,
		list: list,
		create: create,
		update: update,
		remove: remove,
		autofill: autofill,
		bulkAdd: bulkAdd,
		stats: stats,
		removeByPoS: removeByPoS
	};

	return service;

	function get(orcish, num) {
		if (!orcish) {
			return $http.get('/api/words')
			.then(function(response) {
				return response.data;
			})
			.catch(function(error) {
				return $q.reject(error.data);
			});
		} else {
			if (!num) {
				return $q.reject('invalid value for num: ' + num);
			}
			return $http.get('/api/words/' + orcish + '/' + num)
			.then(function(response) {
				return response.data;
			})
			.catch(function(error) {
				return $q.reject(error.data);
			});
		}
	}

	function list(options) {
		return $http.get('/api/words', {
			params: options
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function create(word) {
		return $http.post('/api/words', word)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function update(orcish, num, word) {
		return $http.put('/api/words/' + orcish + '/' + num, word)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function remove(orcish, num) {
		return $http.delete('/api/words/' + orcish + '/' + num)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function autofill(PoS, orcish) {
		if (!PoS || !orcish) {
			return $q.reject('Orcish/Part of Speech must not be empty');
		}
		return $http.get('/api/autofillword/' + PoS + '/' + orcish)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function bulkAdd(data, encoding, updateMethod, order) {
		return $http.post('/api/bulkadd', {
			data: data,
			encoding: encoding,
			updateMethod: updateMethod,
			order: order
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function stats() {
		return $http.post('/api/stats')
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function removeByPoS(PoS) {
		return $http.delete('/api/words-by-pos/' + PoS)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}
}

})();
