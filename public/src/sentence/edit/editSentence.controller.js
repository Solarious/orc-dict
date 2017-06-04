(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('EditSentenceController', EditSentenceController);

EditSentenceController.$inject = [
	'SentencesService', '$location', 'AlertService', '$routeParams'
];

function EditSentenceController(SentencesService, $location, AlertService,
$routeParams) {
	var vm = this;

	vm.update = update;

	activate();

	function activate() {
		vm.id = $routeParams.id;
		vm.submitDisabled = false;

		SentencesService.get(vm.id)
		.then(function(data) {
			vm.sentence = data;
			vm.submitDisabled = false;
		}, function(error) {
			AlertService.error(error || 'Unknown error loading sentence');
		});
	}

	function update() {
		vm.submitDisabled = true;
		SentencesService.update(vm.id, vm.sentence)
		.then(function() {
			$location.path('/sentences');
			AlertService.successDeferred('Sentence updated');
		}, function(error) {
			AlertService.error(error || 'Unknown error updating sentence');
			vm.submitDisabled = false;
		});
	}
}

})();
