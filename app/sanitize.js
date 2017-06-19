'use strict';

module.exports = sanitize;

function sanitize(req, res, next) {
	var str = errorInQuery(req.query) || errorInBody(req.body);
	if (str) {
		return res.status(400).send(str);
	}

	next();
}

function errorInQuery(query) {
	if (query) {
		for (let key in query) {
			let value = query[key];
			let valueStr = (typeof value === 'object') ?
				JSON.stringify(value) : value;
			var msgBase = 'Query ' + key + '=' + valueStr;
			msgBase += ' rejected by sanitizer: ';
			if (key.startsWith('$')) {
				return msgBase + 'key must not start with a "$"';
			}
			if (typeof value !== 'number' && typeof value !== 'string') {
				return msgBase + 'value must be a number or a string';
			}
			if (typeof value === 'string' && value.startsWith('$')) {
				return msgBase + 'value must not start with a "$"';
			}
		}
	}
	return "";
}

function errorInBody(obj) {
	var msgBase = 'Body rejected by sanitizer: ';
	if (obj !== null && typeof obj === 'object') {
		for (let key in obj) {
			if (key.startsWith('$')) {
				return msgBase + 'key ' + key + ' must not start with a "$"';
			}
			let value = obj[key];
			if (typeof value === 'string') {
				let msgBaseForStr = msgBase + 'value for key ' + key + ' ';
				if (value.startsWith('$')) {
					return msgBaseForStr + 'must not start with a "$"';
				}
				if (value.indexOf('<') !== -1) {
					return msgBaseForStr + 'must not contain a "<"';
				}
				if (value.indexOf('>') !== -1) {
					return msgBaseForStr + 'must not contain a ">"';
				}
			}
			let msg = errorInBody(value);
			if (msg) {
				return msg;
			}
		}
	}
	return "";
}
