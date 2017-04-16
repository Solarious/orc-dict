(function() {
'use strict';

angular.
	module('orcDictApp').
	config(config);

config.$inject = ['$locationProvider', '$routeProvider'];

function config($locationProvider, $routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/home.html',
		restricted: false
	})
	.when('/words', {
		templateUrl: 'views/wordsIndex.html',
		controller: 'WordsIndexController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/words/:orcish', {
		templateUrl: 'views/word.html',
		controller: 'WordController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/admin', {
		templateUrl: 'views/admin.html',
		controller: 'AdminController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/newword', {
		templateUrl: 'views/newWord.html',
		controller: 'NewWordController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/bulkadd', {
		templateUrl: 'views/bulkAdd.html',
		controller: 'BulkAddController',
		controllerAs: 'vm',
		restricted: true
	})
	.otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);
}

})();
