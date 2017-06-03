(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('SearchService', searchService);

searchService.$inject = ['$http', '$q'];

function searchService($http, $q) {
	var service = {
		search: search,
		rebuild: rebuild
	};

	return service;

	function search(str) {
		return $http.get('/api/search', {
			params: {
				q: str
			}
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function rebuild() {
		return $http.post('/api/search/rebuild')
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}
}

})();
