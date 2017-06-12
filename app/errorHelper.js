'use strict';

module.exports = {
	getBetterErrorMessage: getBetterErrorMessage
};

function getBetterErrorMessage(error) {
	if (error.errors) {
		var msg = error.message + ': ';
		for (let errorPart in error.errors) {
			let partMsg = error.errors[errorPart].message;
			msg += partMsg + ' ';
		}
		return msg;
	} else {
		return error.message;
	}
}
