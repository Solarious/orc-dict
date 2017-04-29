var mongoose = require('mongoose');
var readlineSync = require('readline-sync');
var User = require('../app/models/user');

var dburl = process.env.MONGODB_URI;

mongoose.connect(dburl);

var action = process.argv[2];

if (action === 'createUser') {
	createUser();
} else if (action === 'removeUser') {
	removeUser();
} else if (action === 'changePassword') {
	changePassword();
} else if (action === 'listUsers') {
	listUsers();
} else {
	console.log(action + ' is not a valid action');
}

function createUser() {
	var username = readlineSync.question('Username: ');
	var email = readlineSync.question('Email: ');
	var password = readlineSync.question('Password: ', {
		hideEchoBack: true,
		mask: ''
	});
	var confirmPassword = readlineSync.question('Confirm Password: ', {
		hideEchoBack: true,
		mask: ''
	});

	if (password !== confirmPassword) {
		console.log('Passwords do not match');
		process.exit();
	}

	var user = new User({
		username: username,
		email: email,
		password: password
	});

	user.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('User ' + user.username + ' created');
		}
		process.exit();
	});
}

function removeUser() {
	var username = readlineSync.question('Username: ');
	User.findOneAndRemove({
		username: username
	}, function (err, user) {
		if (err) {
			console.log(err);
		} else if (!user) {
			console.log('User ' + username + ' does not exist');
		} else {
			console.log('User ' + user.username + ' removed');
		}
		process.exit();
	});
}

function changePassword() {
	var username = readlineSync.question('Username: ');

	User.findOne({
		username: username
	}, function(err, user) {
		if (err) {
			console.log(err);
			process.exit();
		} else if (!user) {
			console.log('User ' + username + ' does not exist');
			process.exit();
		} else {
			var password = readlineSync.question('Password: ', {
				hideEchoBack: true,
				mask: ''
			});
			var confirmPassword = readlineSync.question('Confirm Password: ', {
				hideEchoBack: true,
				mask: ''
			});

			if (password !== confirmPassword) {
				console.log('Passwords do not match');
				process.exit();
			}
			user.password = password;
			user.save(function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log('Password changed for user ' + user.username);
				}
				process.exit();
			});
		}
	});
}

function listUsers() {
	User.find({}, 'username email', function(err, users) {
		if (err) {
			console.log(err);
		} else {
			console.log('Users:');
			for (var i = 0; i < users.length; i++) {
				console.log(users[i].username + ', ' + users[i].email);
			}
		}
		process.exit();
	});
}
