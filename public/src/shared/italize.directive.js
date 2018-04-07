(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictItalize', italize);

function italize() {
	var directive = {
		restrict: 'E',
		scope: {
			text: '<',
		},
		link: link
	};

	return directive;
}

function link(scope, element, attrs, ctrl) {
	rebuild();

	scope.$watch('text', rebuild);

	function rebuild() {
		element.empty();
		var texts = scope.text ? scope.text.split('*') : [];
		for (var i=0; i < texts.length; i++) {
			if ((i % 2) == 0) {
				element.append(document.createTextNode(texts[i]));
			} else {
				element.append($('<em></em>').text(texts[i]));
			}
		}
	}
}

})();
