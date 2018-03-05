'use strict';

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
MongoClient.connect(url, function(err, db) {
	if (err) {
		return console.log(err);
	}

	db.collection('searchindexes')
	.aggregate([
		{
			$group : {
				_id: '$keyword',
				count: {
					$sum: 1
				},
				searchIndexes: {
					$push: {
						message: '$message',
						orcish: '$word.orcish',
						PoS: '$word.PoS',
						english: '$word.english',
						num: '$word.num'
					}
				}
			}
		},
		{
			$sort: {
				count: -1
			}
		},
		{
			$limit: 100
		}
	])
	.toArray(function(err, docs) {
		console.dir(docs, {
			depth: 3,
			breakLength: 1
		});
		db.close();
	});
});
