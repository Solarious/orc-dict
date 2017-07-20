'use strict';

var User = require('../models/user');
var email = require('../email');
var passport = require('passport');
var crypto = require('crypto');

module.exports = addRoutesForUser;

function addRoutesForUser(app) {
	app.post('/api/user/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).send(info.message);
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).send(err.message);
				}
				res.status(200).json({
					status: 'Login successful'
				});
			});
		})(req, res, next);
	});

	app.post('/api/user/logout', function(req, res) {
		req.logout();
		res.json({
			status: 'Logout success'
		});
	});

	app.get('/api/user/status', function(req, res) {
		if (req.isAuthenticated()) {
			return res.status(200).json({
				status: true,
				username: req.user.username
			});
		} else {
			return res.status(200).json({
				status: false
			});
		}
	});

	app.post('/api/user/forgot', function(req, res) {
		var token;

		new Promise(function(resolve, reject) {
			crypto.randomBytes(20, function(err, buf) {
				if (err) {
					reject(err);
				} else {
					resolve(buf.toString('hex'));
				}
			});
		})
		.then(function(data) {
			token = data;
			return User.findOne({
				email: req.body.email
			}).exec();
		})
		.then(function(user) {
			if (!user) {
				throw 'No account with that email address exists';
			}

			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 3600000;
			return user.save();
		})
		.then(function(user) {
			return email.sendReset(user.email, token, req.headers.host);
		})
		.then(function(response) {
			res.send('Reset email successfully sent');
		})
		.catch(function(error) {
			console.log(error);
			res.status(500).send(error.message);
		});
	});

	app.post('/api/user/reset/', function(req, res) {
		var token = req.body.token;
		var password = req.body.password;

		User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: {
				$gt: Date.now()
			}
		}).exec()
		.then(function(user) {
			if (!user) {
				throw 'Password reset token is invalid or has expired';
			} else {
				user.password = password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				return user.save();
			}
		})
		.then(function(user) {
			return res.send('Password successfully reset');
		})
		.catch(function(error) {
			var message = error.message || error;
			return res.status(400).send(message);
		});
	});
}
