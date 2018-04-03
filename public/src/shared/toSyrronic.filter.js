(function() {
'use strict';

angular
	.module('orcDictApp')
	.filter('orcDictToSyrronic', toSyrronic);

function toSyrronic() {
	return function(input) {
		input = input || '';
		return input.toLowerCase()
		.replace(/dj/g, '\ue904')
		.replace(/ch/g, '\ue902')
		.replace(/sh/g, '\ue912')
		.replace(/th/g, '\ue914')
		.replace(/zs/g, '\ue91b')
		.replace(/a/g, '\ue900')
		.replace(/b/g, '\ue901')
		.replace(/d/g, '\ue903')
		.replace(/e/g, '\ue905')
		.replace(/f/g, '\ue906')
		.replace(/g/g, '\ue907')
		.replace(/h/g, '\ue908')
		.replace(/i/g, '\ue909')
		.replace(/k/g, '\ue90a')
		.replace(/l/g, '\ue90b')
		.replace(/m/g, '\ue90c')
		.replace(/n/g, '\ue90d')
		.replace(/o/g, '\ue90e')
		.replace(/p/g, '\ue90f')
		.replace(/r/g, '\ue910')
		.replace(/s/g, '\ue911')
		.replace(/t/g, '\ue913')
		.replace(/u/g, '\ue915')
		.replace(/v/g, '\ue916')
		.replace(/w/g, '\ue917')
		.replace(/x/g, '\ue918')
		.replace(/y/g, '\ue919')
		.replace(/z/g, '\ue91a');
	};
}

})();
