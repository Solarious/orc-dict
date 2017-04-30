(function() {
'use strict';

angular
	.module('orcDictApp')
	.directive('orcDictFileDrop', fileDrop);

function fileDrop() {
	var directive = {
		restrict: 'A',
		scope: {
			orcDictOnLoad: '&'
		},
		link: fileDropLink
	};

	return directive;

	function fileDropLink(scope, element, attrs) {
		element.on('drop', function(dropEvent) {
			dropEvent.preventDefault();
			var dt = dropEvent.originalEvent.dataTransfer;
			var file = dt.files[0];
			if (!file) {
				return;
			}
			var reader = new FileReader();
			reader.onload = function(onloadEvent) {
				scope.$apply(function() {
					scope.orcDictOnLoad({
						$fileContent: onloadEvent.target.result
					});
				});
			};

			reader.readAsText(file);
		});
	}
}


})();
