(function() {
'use strict';

angular.
	module('orcDictApp').
	config(config);

config.$inject = ['$locationProvider', '$routeProvider'];

function config($locationProvider, $routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'main/home.html',
		restricted: false
	})
	.when('/words', {
		templateUrl: 'main/wordsIndex.html',
		controller: 'WordsIndexController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/words/:orcish', {
		templateUrl: 'main/word.html',
		controller: 'WordController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/login', {
		templateUrl: 'admin/login.html',
		controller: 'LoginController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/forgot', {
		templateUrl: 'admin/forgot.html',
		controller: 'ForgotController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/reset/:token', {
		templateUrl: 'admin/reset.html',
		controller: 'ResetController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/admin', {
		templateUrl: 'admin/admin.html',
		controller: 'AdminController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/newword', {
		templateUrl: 'admin/newWord.html',
		controller: 'NewWordController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/bulkadd', {
		templateUrl: 'admin/bulkAdd.html',
		controller: 'BulkAddController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/words/:orcish', {
		templateUrl: 'admin/editWord.html',
		controller: 'EditWordController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/search', {
		templateUrl: 'main/search.html',
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
