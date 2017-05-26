'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;

var WordSchema = new Schema({
	orcish: {
		type: String,
		required: true,
		index: true
	},
	english: {
		type: String,
		required: true
	},
	PoS: {
		type: String,
		required: true,
	},
	num: {
		type: Number,
		required: true
	}
}, { _id: false });

var SearchIndexSchema = new Schema({
	keyword: {
		type: String,
		required: true,
		index: true
	},
	priority: {
		type: Number,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	word: {
		type: WordSchema,
		required: true
	},
	affix: {
		type: String,
		required: true,
		enum: [
			'none',
			'prefix',
			'suffix'
		],
		default: 'none'
	},
	affixLimits: [String]
});

SearchIndexSchema.statics.getMatches = function(str, callback) {
	return this.find({
		keyword: str
	})
	.select({
		keyword: 1,
		priority: 1,
		message: 1,
		word: 1
	})
	.sort({
		priority: 1
	})
	.exec(callback);
};

SearchIndexSchema.statics.getMatchesWithAffix = function(affix, callback) {
	if (affix === 'all') {
		affix = {
			$ne: 'none'
		};
	}

	return this.find({
		affix: affix
	})
	.exec(callback);
};

module.exports = mongoose.model('SearchIndex', SearchIndexSchema);
