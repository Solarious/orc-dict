(function() {
'use strict';

angular.
	module('orcDictApp').
	config(config);

config.$inject = ['$compileProvider'];

function config($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
	$compileProvider.commentDirectivesEnabled(false);
	$compileProvider.cssClassDirectivesEnabled(false);
}

})();
