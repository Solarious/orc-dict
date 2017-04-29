(function() {
'use strict';

angular.
	module('orcDictApp').
	factory('AuthService', authService);

authService.$inject = ['$q', '$timeout', '$http'];

function authService($q, $timeout, $http) {
	var user = null;
	var name = '';

	var service = {
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		login: login,
		logout: logout,
		getUserName: getUserName,
		forgotPassword: forgotPassword,
		resetPassword: resetPassword
	};

	return service;

	function isLoggedIn() {
		if (user) {
			return true;
		} else {
			return false;
		}
	}

	function getUserStatus() {
		return $http.get('/api/user/status')
		.then(function(response) {
			if (response.data.status) {
				user = true;
				name = response.data.username;
			} else {
				user = false;
			}
		}, function(response) {
			user = false;
		});
	}

	function login(username, password) {
		var deferred = $q.defer();

		$http.post('/api/user/login', {
			username: username,
			password: password
		})
		.then(function(response) {
			user = true;
			name = username;
			deferred.resolve(response.data);
		}, function(response) {
			user = false;
			deferred.reject(response.data);
		});

		return deferred.promise;
	}

	function logout() {
		var deferred = $q.defer();

		$http.get('/api/user/logout')
		.then(function(response) {
			user = false;
			deferred.resolve(response.data);
		}, function(response) {
			user = false;
			deferred.reject(response.data);
		});

		return deferred.promise;
	}

	function getUserName() {
		return name;
	}

	function forgotPassword(email) {
		return $http.post('/api/user/forgot', {
			email: email
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}

	function resetPassword(token, password) {
		return $http.post('/api/user/reset', {
			token: token,
			password: password
		})
		.then(function(response) {
			return response.data;
		})
		.catch(function(error) {
			return $q.reject(error.data);
		});
	}
}

})();
