var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;

var SearchIndexSchema = new Schema({
	keyword: {
		type: String,
		required: true
	},
	priority: {
		type: Number,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	orcish: {
		type: String,
		required: true
	}
});

SearchIndexSchema.statics.getMatches = function(str, callback) {
	return this.aggregate()
	.match({
		keyword: str
	})
	.lookup({
		from: 'words',
		localField: 'orcish',
		foreignField: 'orcish',
		as: 'word'
	})
	.unwind('word')
	.project({
		keyword: 1,
		priority: 1,
		message: 1,
		word: {
			orcish: 1,
			english: 1,
			PoS: 1
		}
	})
	.sort({
		priority: 1
	})
	.exec(callback);
};

module.exports = mongoose.model('SeachIndex', SearchIndexSchema);