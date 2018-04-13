(function() {
'use strict';

angular
	.module('orcDictApp')
	.filter('orcDictToSyrronic', toSyrronic);

function toSyrronic() {
	return function(input) {
		if ((typeof input) !== 'string') return input;
		return input
		.replace(/dj/gi, '\ue904')
		.replace(/ch/gi, '\ue902')
		.replace(/sh/gi, '\ue912')
		.replace(/th/gi, '\ue914')
		.replace(/zs/gi, '\ue91b')
		.replace(/a/gi, '\ue900')
		.replace(/b/gi, '\ue901')
		.replace(/d/gi, '\ue903')
		.replace(/e/gi, '\ue905')
		.replace(/f/gi, '\ue906')
		.replace(/g/gi, '\ue907')
		.replace(/h/gi, '\ue908')
		.replace(/i/gi, '\ue909')
		.replace(/k/gi, '\ue90a')
		.replace(/l/gi, '\ue90b')
		.replace(/m/gi, '\ue90c')
		.replace(/n/gi, '\ue90d')
		.replace(/o/gi, '\ue90e')
		.replace(/p/gi, '\ue90f')
		.replace(/qu/gi, '\ue90a\ue917')
		.replace(/q/gi, '\ue90a\ue917')
		.replace(/r/gi, '\ue910')
		.replace(/s/gi, '\ue911')
		.replace(/t/gi, '\ue913')
		.replace(/u/gi, '\ue915')
		.replace(/v/gi, '\ue916')
		.replace(/w/gi, '\ue917')
		.replace(/x/gi, '\ue918')
		.replace(/y/gi, '\ue919')
		.replace(/z/gi, '\ue91a');
	};
}

})();
