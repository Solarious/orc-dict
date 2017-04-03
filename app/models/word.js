var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;

var SingularPluralSchema = new Schema({
	singular: {
		type: String,
		required: true
	},
	plural: {
		type: String,
		required: true
	}
}, { _id: false });

var VerbConjGroupSchema = new Schema({
	first: {
		type: SingularPluralSchema,
		required: true
	},
	second: {
		type: SingularPluralSchema,
		required: true
	},
	third: {
		type: SingularPluralSchema,
		required: true
	}
}, { _id: false });

var VerbParticipleSchema = new Schema({
	feminine: {
		type: String,
		required: true
	},
	masculine: {
		type: String,
		required: true
	}
}, { _id: false });

var VerbAgentSchema = new Schema({
	feminine: {
		type: String,
		required: true
	},
	masculine: {
		type: String,
		required: true
	},
	dishonorable: {
		type: String,
		required: true
	},
}, { _id: false });

var VerbVoiceSchema = new Schema({
	present: {
		type: VerbConjGroupSchema,
		required: true
	},
	past: {
		type: VerbConjGroupSchema,
		required: true
	},
	future: {
		type: VerbConjGroupSchema,
		required: true
	},
	pastPerfect: {
		type: VerbConjGroupSchema,
		required: true
	},
	futurePerfect: {
		type: VerbConjGroupSchema,
		required: true
	}
}, { _id: false });

var VerbSchema = new Schema({
	conjugation: {
		type: String,
		enum: ['first', 'second', 'irregular']
	},
	infinitive: {
		type: String,
		required: true
	},
	active: {
		type: VerbVoiceSchema,
		required: true
	},
	passive: {
		type: VerbVoiceSchema,
		required: true
	},
	imperative: {
		type: SingularPluralSchema,
		required: true
	},
	gerund: {
		type: String,
		required: true
	},
	participle: {
		type: VerbParticipleSchema,
		required: true
	},
	agent: {
		type: VerbAgentSchema,
		required: true
	}
}, { _id: false });

var WordSchema = new Schema({
	orcish: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	english: {
		type: String,
		required: true
	},
	PoS: {
		type: String,
		required: true,
		enum: ['noun', 'verb', 'adjective', 'adverb']
	},
	verb: VerbSchema
});

WordSchema.pre('save', function(next) {
	if (this.PoS == 'verb') {
		if (!this.verb) {
			next(new Error('Word has PoS=="verb" but verb is undefined'));
			return;
		}
	}
	next();
});

module.exports = mongoose.model('Word', WordSchema);
