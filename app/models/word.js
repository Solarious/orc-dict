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
		enum: ['first', 'second', 'irregular'],
		required: true
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

var NounSchema = new Schema({
	declension: {
		type: String,
		enum: ['first', 'second', 'third', 'fourth', 'fifth'],
		required: true
	},
	gender: {
		type: String,
		enum: ['feminine', 'masculine', 'neutral'],
		required: true
	},
	nominative: {
		type: SingularPluralSchema,
		required: true
	},
	genitive: {
		type: SingularPluralSchema,
		required: true
	},
	dative: {
		type: SingularPluralSchema,
		required: true
	},
	accusative: {
		type: SingularPluralSchema,
		required: true
	},
	vocative: {
		type: SingularPluralSchema,
		required: true
	}
}, { _id: false});

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
	if (this.PoS === 'verb') {
		if (!this.verb) {
			next(new Error('Word has PoS=="verb" but verb is undefined'));
			return;
		}
	} else if (this.PoS === 'noun') {
		var nout = this.noun
		if (!noun) {
			next(new Error('Word has PoS==noun but noun is undefined'));
			return;
		}
		if (noun.declension === 'first') {
			if (!(noun.feminine && !noun.masculine && !noun.neutral)) {
				next(new Error('1st declention noun must only have feminine'));
				return;
			}
		} else if (noun.declension === 'second') {
			if (!(!noun.feminine && noun.masculine && noun.neutral)) {
				next(new Error(
					'1st declention noun must have only masculine and neutral'
				));
				return;
			}
		} else if (noun.declension === 'third') {
			if (!(noun.feminine && !noun.masculine && !noun.neutral)) {
				next(new Error('1st declention noun must have only feminine'));
				return;
			}
		} else if (noun.declension === 'fourth') {
			if (!(!noun.feminine && noun.masculine && !noun.neutral)) {
				next(new Error('1st declention noun must have only masculine'));
				return;
			}
		} else if (noun.declension === 'fifth') {
			if (!(!noun.feminine && !noun.masculine && noun.neutral)) {
				next(new Error('1st declention noun must have only neutral'));
				return;
			}
		}
	}
	next();
});

module.exports = mongoose.model('Word', WordSchema);
