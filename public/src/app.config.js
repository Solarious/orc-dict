(function() {
'use strict';

angular.
	module('orcDictApp').
	config(config);

config.$inject = ['$locationProvider', '$routeProvider'];

function config($locationProvider, $routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'src/main/home.html',
		restricted: false
	})
	.when('/words', {
		templateUrl: 'src/main/wordsIndex.html',
		controller: 'WordsIndexController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/words/:orcish/:num', {
		templateUrl: 'src/main/word.html',
		controller: 'WordController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/login', {
		templateUrl: 'src/admin/login.html',
		controller: 'LoginController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/forgot', {
		templateUrl: 'src/admin/forgot.html',
		controller: 'ForgotController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/reset/:token', {
		templateUrl: 'src/admin/reset.html',
		controller: 'ResetController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/admin', {
		templateUrl: 'src/admin/admin.html',
		controller: 'AdminController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/newword', {
		templateUrl: 'src/admin/newWord.html',
		controller: 'NewWordController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/bulkadd', {
		templateUrl: 'src/admin/bulkAdd.html',
		controller: 'BulkAddController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/words/:orcish/:num', {
		templateUrl: 'src/admin/editWord.html',
		controller: 'EditWordController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/statistics', {
		templateUrl: 'src/admin/stats.html',
		controller: 'StatsController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/search', {
		templateUrl: 'src/main/search.html',
		controller: 'SearchController',
		controllerAs: 'vm',
		restricted: false
	})
	.otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);
}

})();
