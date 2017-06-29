'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Use mative ES6 promises
mongoose.Promise = global.Promise;
var getBetterErrorMessage = require('../errorHelper').getBetterErrorMessage;

// -------------
// Sub-documents
// -------------

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

var NounSchema = new Schema({
	declension: {
		type: String,
		enum: ['first', 'second', 'third', 'fourth', 'fifth', 'irregular'],
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
	masculine: {
		type: AdjectiveDeclensionSchema,
		required: true
	}
}, { _id: false});

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

var VerbAgentSchema = new Schema({
	feminine: {
		type: NounSchema,
		required: true
	},
	masculine: {
		type: NounSchema,
		required: true
	},
	dishonorable: {
		type: NounSchema,
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

var VerbInfinitiveSchema = new Schema({
	active: {
		type: String,
		required: true
	},
	passive: {
		type: String,
		required: true
	}
}, { _id: false });

var VerbSchema = new Schema({
	conjugation: {
		type: String,
		enum: ['first', 'second'],
		required: true
	},
	infinitive: {
		type: VerbInfinitiveSchema,
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
		type: NounSchema,
		required: true
	},
	participle: {
		type: AdjectiveSchema,
		required: true
	},
	agent: {
		type: VerbAgentSchema,
		required: true
	}
}, { _id: false });

var PronounSchema = new Schema({
	type: {
		type: String,
		required: true,
		enum: [
			'pronoun',
			'possessive',
			'demonstrative',
			'relative'
		]
	},
	number: {
		type: String,
		required: true,
		enum: [
			'singular',
			'plural'
		]
	},
	nominative: {
		type: String,
		required: true
	},
	genitive: {
		type: String,
		required: true
	},
	dative: {
		type: String,
		required: true
	},
	accusative: {
		type: String,
		required: true
	},
	vocative: {
		type: String,
		required: true
	}
}, { _id: false });

var CopulaInfinitiveSchema = new Schema({
	present: {
		type: String,
		required: false
	},
	future: {
		type: String,
		required: false
	}
}, { _id: false });

var CopulaSchema = new Schema({
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
	infinitive: {
		type: CopulaInfinitiveSchema,
		required: true
	},
	gerund: {
		type: NounSchema,
		required: true
	}
}, { _id: false });

var LimitSchema = new Schema({
	PoS: {
		type: String,
		enum: [
			'adjective',
			'adverb',
			'cardinal',
			'conjunction',
			'exclamation',
			'interjection',
			'noun',
			'preposition',
			'pronoun',
			'verb',
		],
		required: true
	}
}, { _id: false });

var AffixSchema = new Schema({
	limits: [LimitSchema]
}, { _id: false });

var TextIndexHelperSchema = new Schema({
	english: {
		type: String,
		required: true
	},
	language: {
		type: String,
		required: true
	}
}, { _id: false });

// ----------------------
// The actual Word Schema
// ----------------------

var WordSchema = new Schema({
	orcish: {
		type: String,
		required: true,
		lowercase: true
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
			'contraction',
			'copular verb',
			'exclamation',
			'interjection',
			'noun',
			'prefix',
			'preposition',
			'pronoun',
			'suffix',
			'verb',
		]
	},
	num: {
		type: Number
	},
	extraInfo: String,
	coinedBy: String,
	namedAfter: String,
	verb: VerbSchema,
	noun: NounSchema,
	adjective: AdjectiveSchema,
	pronoun: PronounSchema,
	affix: AffixSchema,
	copula: CopulaSchema,
	textIndexHelper: TextIndexHelperSchema
});

WordSchema.index({
	orcish: 1,
	num: 1
}, {
	unique: true
});

WordSchema.index({
	english: 'text',
	extraInfo: 'text',
	coinedBy: 'text',
	namedAfter: 'text',
	'textIndexHelper.english': 'text'
}, {
	weights: {
		english: 20,
		extraInfo: 5,
		coinedBy: 1,
		namedAfter: 1,
		'textIndexHelper.english': 20
	}
});

// -----------------
// Hooks and statics
// -----------------

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
	if (this.pronoun !== undefined && this.PoS !== 'pronoun') {
		this.pronoun = undefined;
	}
	if (this.affix !== undefined &&
	(this.PoS !== 'prefix' && this.PoS !== 'suffix')) {
		this.affix = undefined;
	}
	if (this.PoS === 'prefix' || this.PoS === 'suffix') {
		if (this.affix === undefined) {
			this.affix = {
				limits: []
			};
		}
	}
	if (this.copula !== undefined && this.PoS !== 'copular verb') {
		this.copula = undefined;
	}
	next();
});

function validateNoun(noun, preStr) {
	preStr = preStr || '';
	if (noun.declension === 'first') {
		if (noun.gender !== 'feminine') {
			return preStr + 'First declension noun must have gender feminine';
		}
	} else if (noun.declension === 'second') {
		if (noun.gender === 'feminine' ) {
			return preStr + 'Second declension noun must have gender ' +
			'masculine or neutral';
		}
	} else if (noun.declension === 'third') {
		if (noun.gender !== 'feminine') {
			return preStr + 'Third declension noun must have gender feminine';
		}
	} else if (noun.declension === 'fourth') {
		if (noun.gender !== 'masculine') {
			return preStr + 'Fourth declension noun must have gender masculine';
		}
	} else if (noun.declension === 'fifth') {
		if (noun.gender !== 'neutral') {
			return preStr + 'Fifth declension noun must have gender neutral';
		}
	}

	return '';
}

WordSchema.pre('save', function(next) {
	if (this.PoS === 'verb') {
		let verb = this.verb;
		if (!verb) {
			next(new Error('Word has PoS=="verb" but verb is undefined'));
			return;
		}
		let result = validateNoun(verb.gerund, 'Gerund as a ');
		if (result) {
			return next(new Error(result));
		}
		result = validateNoun(
			verb.agent.feminine, 'Feminine Agent as a '
		);
		if (result) {
			return next(new Error(result));
		}
		result = validateNoun(
			verb.agent.masculine, 'Masculine Agent as a '
		);
		if (result) {
			return next(new Error(result));
		}
		result = validateNoun(
			verb.agent.dishonorable, 'Dishonorable Agent as a '
		);
		if (result) {
			return next(new Error(result));
		}
	} else if (this.PoS === 'noun') {
		let noun = this.noun;
		if (!noun) {
			next(new Error('Word has PoS==noun but noun is undefined'));
			return;
		}
		let result = validateNoun(noun);
		if (result) {
			next(new Error(result));
			return;
		}
	} else if (this.PoS === 'adjective') {
		if (!this.adjective) {
			next(new Error(
				'Word has PoS==adjective but adjective is undefined'
			));
			return;
		}
	} else if (this.PoS === 'pronoun') {
		if (!this.pronoun) {
			return next(new Error(
				'Word has PoS=="pronoun" but pronoun is undefined'
			));
		}
	} else if (this.PoS === 'prefix' || this.PoS == 'suffix') {
		if (!this.affix) {
			return next(new Error(
				'Word has PoS=="' + this.PoS + '" but affix is undefined'
			));
		}
	} else if (this.PoS === 'copular verb') {
		if (!this.copula) {
			next(new Error(
				'Word has PoS=="copular verb" but copula is undefined'
			));
		}
		let result = validateNoun(this.copula.gerund, 'Gerund as a ');
		if (result) {
			return next(new Error(result));
		}
	}

	var useLangNone = [
		'adverb',
		'cardinal',
		'conjunction',
		'contraction',
		'copular verb',
		'exclamation',
		'prefix',
		'preposition',
		'pronoun',
		'suffix',
	];
	if (useLangNone.indexOf(this.PoS) !== -1) {
		this.textIndexHelper = {
			english: this.english,
			language: 'none'
		};
	} else {
		this.textIndexHelper = undefined;
	}

	if (this.num) {
		return next();
	}

	var self = this;
	var Word = self.constructor;
	Word.find({
		'orcish': self.orcish
	})
	.select({
		orcish: 1,
		num: 1
	})
	.exec()
	.then(function(words) {
		var invalidNums = words.map(function(word) {
			return word.num;
		});
		var num = 1;
		while (invalidNums.indexOf(num) !== -1) {
			num++;
		}
		self.num = num;
		next();
	})
	.catch(function(error) {
		next(error);
	});
});

WordSchema.statics.getOrcishNums = function(cb) {
	return this.aggregate()
	.group({
		_id: '$orcish',
		nums: {
			$push: '$num'
		}
	})
	.exec(cb);
};

WordSchema.statics.insertManyWithRetry = function(words, prevResults) {
	var Word = this;
	prevResults = prevResults || {
		successes: [],
		failures: []
	};
	return Word.getOrcishNums()
	.then(function(results) {
		var obj = results.reduce(function(acc, results) {
			acc[results._id] = results.nums;
			return acc;
		}, {});
		words.forEach(function(word) {
			if (!word.num) {
				let invalidNums = obj[word.orcish] || [];
				let num = 1;
				while (invalidNums.indexOf(num) !== -1) {
					num++;
				}
				word.num = num;
				invalidNums.push(num);
				obj[word.orcish] = invalidNums;
			}
		});
		return Promise.all(words.map(function(word) {
			return new Word(word).save()
			.then(function(result) {
				return {
					success: true,
					word: result
				};
			})
			.catch(function(error) {
				return {
					success: false,
					word: word,
					error: error
				};
			});
		}));
	})
	.then(function(results) {
		return results.reduce(function(acc, result) {
			if (result.success) {
				acc.successes.push(result.word);
			} else {
				acc.failures.push({
					errorMessage: getBetterErrorMessage(result.error),
					word: result.word
				});
			}
			return acc;
		}, prevResults);
	})
	.then(function(results) {
		var wordsToRetry = [];
		results.failures = results.failures.filter(function(failure) {
			if (failure.errorMessage ===
			'A word with the same orcish and num already exists') {
				delete failure.word.num;
				wordsToRetry.push(failure.word);
				return false;
			} else {
				return true;
			}
		});
		if (wordsToRetry.length > 0) {
			return Word.insertManyWithRetry(wordsToRetry, results);
		} else {
			return results;
		}
	});
};

WordSchema.pre('insertMany', function(next, docs) {
	var Word = mongoose.models.Word;
	Word.getOrcishNums()
	.then(function(results) {
		var obj = results.reduce(function(acc, results) {
			acc[results._id] = results.nums;
			return acc;
		}, {});
		docs.forEach(function(doc) {
			var invalidNums = obj[doc.orcish] || [];
			var num = 1;
			while (invalidNums.indexOf(num) !== -1) {
				num++;
			}
			doc.num = num;
			invalidNums.push(num);
			obj[doc.orcish] = invalidNums;
		});
		next();
	});
});

WordSchema.post('save', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('A word with the same orcish and num already exists'));
	} else {
		next(error);
	}
});

WordSchema.post('insertMany', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		/*var msg = error.message;
		var pos = msg.search('dup key');
		msg = msg.slice(pos + 14, -3);
		next(new Error(
			'Word with orcish ' + msg + ' and num ' + num + ' already exists'
		));*/
		next(error);
	} else {
		next(error);
	}
});

WordSchema.post('update', function(error, res, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('A word with the same orcish and num already exists'));
	} else {
		next(error);
	}
});

module.exports = mongoose.model('Word', WordSchema);
