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

var port = process.env.PORT;
var dburl = process.env.MONGODB_URI;

mongoose.connect(dburl);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
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

require('./app/routes')(app);
require('./app/authentication')();
app.listen(port);
console.log('Server started on port ' + port);

exports = module.exports = app;
