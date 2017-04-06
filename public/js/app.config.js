(function() {
'use strict';

angular.
	module('orcDictApp').
	config(config);

config.$inject = ['$locationProvider', '$routeProvider'];

function config($locationProvider, $routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/home.html'
	})
	.when('/words', {
		templateUrl: 'views/wordsIndex.html',
		controller: 'WordsIndexController',
		controllerAs: 'vm'
	})
	.when('/words/:orcish', {
		templateUrl: 'views/word.html',
		controller: 'WordController',
		controllerAs: 'vm'
	});

	$locationProvider.html5Mode(true);
}

})();
