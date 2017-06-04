(function() {
'use strict';

angular.
	module('orcDictApp').
	config(config);

config.$inject = ['$locationProvider', '$routeProvider'];

function config($locationProvider, $routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'src/layout/home.html',
		restricted: false
	})
	.when('/words', {
		templateUrl: 'src/viewing/wordsIndex.html',
		controller: 'WordsIndexController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/words/:orcish/:num', {
		templateUrl: 'src/viewing/word.html',
		controller: 'WordController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/login', {
		templateUrl: 'src/account/login.html',
		controller: 'LoginController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/forgot', {
		templateUrl: 'src/accout/forgot.html',
		controller: 'ForgotController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/reset/:token', {
		templateUrl: 'src/account/reset.html',
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
		templateUrl: 'src/admin/new/newWord.html',
		controller: 'NewWordController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/bulkadd', {
		templateUrl: 'src/admin/bulkAdd/bulkAdd.html',
		controller: 'BulkAddController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/words/:orcish/:num', {
		templateUrl: 'src/admin/edit/editWord.html',
		controller: 'EditWordController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/statistics', {
		templateUrl: 'src/admin/stats/stats.html',
		controller: 'StatsController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/admin/extra', {
		templateUrl: 'src/admin/extra/extra.html',
		controller: 'ExtraController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/search', {
		templateUrl: 'src/viewing/search.html',
		controller: 'SearchController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/sentences', {
		templateUrl: 'src/sentence/sentence.html',
		controller: 'SentenceController',
		controllerAs: 'vm',
		restricted: false
	})
	.when('/sentences/new', {
		templateUrl: 'src/sentence/new/newSentence.html',
		controller: 'NewSentenceController',
		controllerAs: 'vm',
		restricted: true
	})
	.when('/sentences/edit/:id', {
		templateUrl: 'src/sentence/edit/editSentence.html',
		controller: 'EditSentenceController',
		controllerAs: 'vm',
		restricted: true
	})
	.otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);
}

})();
