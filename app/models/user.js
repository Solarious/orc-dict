'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config.js');

var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

UserSchema.pre('save', function(next) {
	var user = this;
	var SALT_FACTOR = config.WORK_FACTOR;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if (err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) {
				return next(err);
			}

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
	var user = this;
	bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
		if (err) {
			return callback(err);
		}

		var SALT_FACTOR = config.WORK_FACTOR || 12;
		if (isMatch && (bcrypt.getRounds(user.password) != SALT_FACTOR)) {
			user.password = candidatePassword;
			user.save();
		}

		callback(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);
