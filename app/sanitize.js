'use strict';

module.exports = sanitize;

function sanitize(req, res, next) {
	var str = errorInQueryParams(req.query, 'query') ||
	errorInQueryParams(req.params, 'params') ||
	errorInBody(req.body, 'body');
	if (str) {
		return res.status(400).send(str);
	}

	next();
}

function errorInQueryParams(qp, qpName) {
	if (qp) {
		for (let key in qp) {
			let value = qp[key];
			var msgBase = qpName + ' ' + key + '=' + value;
			msgBase += 'rejected by sanitizer: ';
			if (typeof value !== 'number' && typeof value !== 'string') {
				return msgBase + ' value must be a number or a string';
			}
			if (typeof value === 'string' && value.startsWith('$')) {
				return msgBase + ' value must not start with a $';
			}
		}
	}
	return "";
}

function errorInBody(obj, name) {
	if (typeof obj === 'string') {
		if (obj.startsWith('$')) {
			return name;
		} else {
			return "";
		}
	}
	if (obj !== null && typeof obj === 'object') {
		for (let key in obj) {
			let msg = errorInBody(obj[key], name + '.' + key);
			if (msg) {
				return msg;
			}
		}
	}
	return "";
}
