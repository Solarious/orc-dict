var mongoose = require('mongoose');
var search = require('../app/search');

var dburl = process.env.MONGODB_URI;

mongoose.connect(dburl);

rebuild();

function rebuild() {
	var start = process.hrtime();
	search.rebuild(function(error, data) {
		if (error) {
			console.log('Error with search.rebuild:');
			console.log(error.message);
		}
		var total = process.hrtime(start);
		var ms = total[1] / 1000000;
		console.log('rebuild took ' + ms + ' ms');
		process.exit();
	});
}
