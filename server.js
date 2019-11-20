'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var csurf = require('csurf');
var MongoStore = require('connect-mongo')(session);
var helmet = require('helmet');
var sanitize = require('./app/sanitize');
var stats = require('./app/stats');
var config = require('./config');

var dburl;
var port;
if (config.NODE_ENV === 'test') {
	port = config.PORT_TESTING;
	dburl = config.MONGODB_TESTING_URI;
	config.WORK_FACTOR = 5;
} else {
	port = config.PORT;
	dburl = config.MONGODB_URI;
}

mongoose.connect(dburl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

app.use(helmet({
	hsts: (config.NODE_ENV === 'production')
}));

app.enable('trust proxy');

if ((config.NODE_ENV === 'production') && (config.FORCE_HTTPS === true)) {
	app.use(function(req, res, next) {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect(301, 'https://' + req.headers.host + req.url);
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

if (config.NODE_ENV !== 'test') {
	app.use(morgan('dev'));
}

app.use(sanitize);

app.disable('etag');
app.use(session({
	secret: config.SECRET_KEY,
	name: 'sessionId',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: (config.NODE_ENV === 'production'),
		httpOnly: true
	},
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		touchAfter: 24 * 3600
	})
}));
app.use(passport.initialize());
app.use(passport.session());
require('./app/authentication')();

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

app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).send('Internal error');
});

// Tells stats to prepare the its cache
stats.get();

require('./app/routes')(app);
console.log('NODE_ENV: ' + config.NODE_ENV);
app.listen(port);
console.log('Server started on port ' + port);

exports = module.exports = app;
