'use strict';

var sendgrid = require('sendgrid');
var helper = sendgrid.mail;
var config = require('../config');

module.exports = {
	sendReset: sendReset
};

function sendReset(toEmail, token, host) {
	var text = 'A password reset has been requested for your account.\n\n';
	text += 'Here is your reset link\n\n';
	text += 'https://' + host + '/reset/' + token + '\n\n';
	text += 'If you did not request this, please ignore this email';

	var mail = new helper.Mail(
		new helper.Email(
			config.SENDGRID_USERNAME,
			'The Orcish Dictionary Team'
		),
		'Orc Dict Password Reset',
		new helper.Email(toEmail),
		new helper.Content('text/plain', text)
	);

	var sg = sendgrid(config.SENDGRID_API_KEY);
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});

	return sg.API(request);
}
