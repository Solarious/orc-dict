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

var AdjectiveDeclensionSchema = new Schema({
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

var AdjectiveSchema = new Schema({
	feminine: {
		type: AdjectiveDeclensionSchema,
		required: true
	},
	masculineNeutral: {
		type: AdjectiveDeclensionSchema,
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
		enum: [
			'adjective',
			'adverb',
			'cardinal',
			'conjunction',
			'exclamation',
			'interjection',
			'noun',
			'preposition',
			'verb',
		]
	},
	verb: VerbSchema,
	noun: NounSchema,
	adjective: AdjectiveSchema
});

WordSchema.pre('validate', function(next) {
	if (this.verb !== undefined && this.PoS !== 'verb') {
		this.verb = undefined;
	}
	if (this.noun !== undefined && this.PoS !== 'noun') {
		this.noun = undefined;
	}
	if (this.adjective !== undefined && this.PoS !== 'adjective') {
		this.adjective = undefined;
	}
	next();
});

WordSchema.pre('save', function(next) {
	if (this.PoS === 'verb') {
		if (!this.verb) {
			next(new Error('Word has PoS=="verb" but verb is undefined'));
			return;
		}
	} else if (this.PoS === 'noun') {
		var noun = this.noun
		if (!noun) {
			next(new Error('Word has PoS==noun but noun is undefined'));
			return;
		}
		if (noun.declension === 'first') {
			if (noun.gender !== 'feminine') {
				next(new Error(
					'1st declention noun must have gender feminine'
				));
				return;
			}
		} else if (noun.declension === 'second') {
			if (noun.gender === 'neutral' ) {
				next(new Error(
					'1st declention noun must have gender masculine or neutral'
				));
				return;
			}
		} else if (noun.declension === 'third') {
			if (noun.gender !== 'feminine') {
				next(new Error(
					'1st declention noun must have gender feminine'
				));
				return;
			}
		} else if (noun.declension === 'fourth') {
			if (noun.gender !== 'masculine') {
				next(new Error(
					'1st declention noun must have gender masculine'
				));
				return;
			}
		} else if (noun.declension === 'fifth') {
			if (noun.gender !== 'neutral') {
				next(new Error(
					'1st declention noun must have gender neutral'
				));
				return;
			}
		}
	} else if (this.PoS === 'adjective') {
		if (!this.adjective) {
			next(new Error(
				'Word has PoS==adjective but adjective is undefined'
			));
			return;
		}
	}
	next();
});

WordSchema.post('save', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('A word with the same orcish already exists'));
	} else {
		next(error);
	}
});

WordSchema.post('insertMany', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		var msg = error.message;
		var pos = msg.search('dup key');
		msg = msg.slice(pos + 14, -3);
		next(new Error('Word with orcish ' + msg + ' already exists'));
	} else {
		next(error);
	}
});

WordSchema.post('update', function(error, res, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('A word with the same orcish already exists'));
	} else {
		next(error);
	}
});

module.exports = mongoose.model('Word', WordSchema);
