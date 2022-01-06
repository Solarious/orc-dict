var mongoose = require('mongoose');
var Word = require('../app/models/word');
var config = require('../config');

mongoose.connect(config.MONGODB_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

Word.deleteMany({}).exec()
.then(function(data) {
	console.log(data.result);
	process.exit();
})
.catch(function(error) {
	console.log(error);
	process.exit();
});
