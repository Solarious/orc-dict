'use strict';

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
MongoClient.connect(url, function(err, db) {
	if (err) {
		return console.log(err);
	}

	db.collection('words')
	.aggregate([
		{
			$group : {
				_id: '$orcish',
				count: {
					$sum: 1
				},
				words: {
					$push: {
						orcish: '$orcish',
						PoS: '$PoS',
						english: '$english',
						num: '$num'
					}
				}
			}
		},
		{
			$match: {
				count: {
					$gt: 1
				}
			}
		}
	])
	.toArray(function(err, docs) {
		prettyDraw(docs);
		db.close();
	});
});

function prettyDraw(input) {
	console.log(`There are ${input.length} duplicates`);
	console.log();
	input.forEach(entry => {
		console.log(entry._id);
		entry.words.forEach(
			w => console.log(`    ${w.orcish}, ${w.PoS}, ${w.english}`)
		);
		console.log();
	});
}
