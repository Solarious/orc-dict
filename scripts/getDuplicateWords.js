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
		console.dir(docs, {
			depth: 3,
			breakLength: 1
		});
		console.log(docs.length);
		db.close();
	});
});
