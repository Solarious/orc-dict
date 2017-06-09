'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var csurf = require('csurf');
var MongoStore = require('connect-mongo')(session);
var sanitize = require('./app/sanitize');
var stats = require('./app/stats');

var dburl;
var port;
if (process.env.NODE_ENV === 'test') {
	port = process.env.PORT_TESTING;
	dburl = process.env.MONGODB_TESTING_URI;
} else {
	port = process.env.PORT;
	dburl = process.env.MONGODB_URI;
}

mongoose.connect(dburl);

if (process.env.NODE_ENV === 'production') {
	app.use(function(req, res, next) {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect('https://' + req.headers.host + req.url);
		} else {
			return next();
		}
	});
	console.log('Using https redirect');
}

app.use(bodyParser.json({
	limit: '200kb'
}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('dev'));
}

app.use(sanitize);

app.disable('etag');
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		touchAfter: 24 * 3600
	})
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(csurf());
app.use(function(req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	next();
});
app.use(function(err, req, res, next) {
	if (err.code !== 'EBADCSRFTOKEN') {
		return next(err);
	} else {
		res.status(403).send('Invalid/Missing csrf token');
	}
});

// Tells stats to prepare the its cache
stats.get();

require('./app/routes')(app);
require('./app/authentication')();
console.log('NODE_ENV: ' + process.env.NODE_ENV);
app.listen(port);
console.log('Server started on port ' + port);

exports = module.exports = app;
