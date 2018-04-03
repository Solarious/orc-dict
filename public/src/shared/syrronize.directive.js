(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictSyrronize', syrronize);

function syrronize() {
	var directive = {
		restrict: 'E',
		scope: {
			text: '=',
			raw: '@'
		},
		template:
			'<div class="syrronic">{{raw ? raw : text | orcDictToSyrronic}}</div>'

	};

	return directive;
}

})();
