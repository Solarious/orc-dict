(function() {
'use strict';

angular
	.module('orcDictApp')
	.controller('NewSentenceController', NewSentenceController);

NewSentenceController.$inject = [
	'SentencesService', '$location', 'AlertService'
];

function NewSentenceController(SentencesService, $location, AlertService) {
	var vm = this;

	vm.submit = submit;

	activate();

	function activate() {
		vm.sentence = {};
		vm.submitDisabled = false;
	}

	function submit() {
		vm.submitDisabled = true;
		SentencesService.create(vm.sentence)
		.then(function() {
			$location.path('/sentences');
			AlertService.successDeferred('Sentence created');
		}, function(error) {
			AlertService.error(error || 'Unknown error creating sentence');
			vm.submitDisabled = false;
		});
	}
}

})();
