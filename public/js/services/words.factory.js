(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('WordsService', wordsService);

wordsService.$inject = ['$http', '$q'];

function wordsService($http, $q) {
	var service = {
		get: get,
		create: create,
		update: update,
		remove: remove,
		autofill: autofill
	};

	return service;

	function get(orcish) {
		if (!orcish) {
			return $http.get('/api/words')
			.then(function(response) {
				return response.data;
			})
			.catch(function(error) {
				return $q.reject(e);
			});
		} else {
			return $http.get('/api/words/' + orcish)
			.then(function(response) {
				return response.data;
			})
			.catch(function(error) {
				return $q.reject(e);
			});
		}
	}

	function create(word) {
		return $http.post('/api/words', word)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(e);
		});
	}

	function update(orcish, word) {
		return $http.put('/api/words/' + orcish, word)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(e);
		});
	}

	function remove(orcish) {
		return $http.delete('/api/words/' + orcish)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(e);
		});
	}

	function autofill(PoS, orcish) {
		return $http.get('/api/autofillword/' + Pos + '/' + orcish)
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(e);
		});
	}
}

})();
