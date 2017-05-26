var mongoose = require('mongoose');
var Word = require('../app/models/word');

var dburl = process.env.MONGODB_URI;

mongoose.connect(dburl);

Word.remove({}).exec()
.then(function(data) {
	console.log(data.result);
	process.exit();
})
.catch(function(error) {
	console.log(error);
	process.exit();
});
