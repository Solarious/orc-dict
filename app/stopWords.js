'use strict';

module.exports = {
	isStopWord: isStopWord,
	getLangNone: getLangNone
};

function isStopWord(wordStr) {
	return stopWords[wordStr] || false;
}

function getLangNone(english, PoS) {
	english = english.toLowerCase();
	if (PoS === 'adjective') { return forAdjective(english); }
	if (PoS === 'adverb') { return forAdverb(english); }
	if (PoS === 'cardinal') { return ''; }
	if (PoS === 'conjunction') { return addAll(english); }
	if (PoS === 'contraction') { return addAll(english); }
	if (PoS === 'copular verb') { return addAll(english); }
	if (PoS === 'exclamation') { return forExclamation(english); }
	if (PoS === 'interjection') { return ''; }
	if (PoS === 'noun') { return forNoun(english); }
	if (PoS === 'prefix') { return forAffix(english); }
	if (PoS === 'preposition') { return forPreposition(english); }
	if (PoS === 'pronoun') { return addAll(english); }
	if (PoS === 'suffix') { return forAffix(english); }
	if (PoS === 'verb') { return forVerb(english); }
	throw new Error('Invalid PoS: ' + PoS);
}

function split(str) {
	return str
	.split(/(,|;) */)
	.map(function(part) {
		return part.split(' ');
	});
}

function addAll(english) {
	var words = [];
	var parts = split(english);
	parts.forEach(function(part) {
		part.forEach(function(word) {
			if (isStopWord(word)) {
				words.push(word);
			}
		});
	});
	return words.join(' ');
}

function forAdjective(english) {
	var words = [];
	var parts = split(english);
	parts.forEach(function(part) {
		if (part.length < 3) {
			part.forEach(function(word) {
				if (isStopWord(word)) {
					words.push(word);
				}
			});
		}
	});
	return words.join(' ');
}

function forAdverb(english) {
	var words = [];
	var parts = split(english);
	if (parts.length === 1) {
		parts[0].forEach(function(word) {
			if (isStopWord(word)) {
				words.push(word);
			}
		});
	} else {
		parts.forEach(function(part) {
			if (part.length === 1 && isStopWord(part[0])) {
				words.push(part[0]);
			}
		});
	}
	return words.join(' ');
}

function forExclamation(english) {
	var words = [];
	var parts = split(english);
	parts.forEach(function(part) {
		if (part.length < 4) {
			part.forEach(function(word) {
				if (isStopWord(word)) {
					words.push(word);
				}
			});
		}
	});
	return words.join(' ');
}

function forNoun(english) {
	var parts = split(english);
	if (parts[0] && parts[0].length === 1 && isStopWord(parts[0][0])) {
		return parts[0][0];
	} else {
		return '';
	}
}

function forAffix(english) {
	var m = /^-?(\w+)-?/.exec(english);
	if (m && isStopWord(m[0])) {
		return m[0];
	} else {
		return '';
	}
}

function forPreposition(english) {
	var words = [];
	var parts = split(english);
	parts.forEach(function(part) {
		if (part.length === 1 && isStopWord(part[0])) {
			words.push(part[0]);
		}
	});
	return words.join(' ');
}

function forVerb(english) {
	var words = [];
	var parts = split(english);
	parts.forEach(function(part) {
		if (part.length === 2 && part[0] === 'to' && isStopWord(part[1])) {
			words.push(part[1]);
		}
	});
	return words.join(' ');
}

var stopWords = {
	"a": true,
	"about": true,
	"above": true,
	"after": true,
	"again": true,
	"against": true,
	"all": true,
	"am": true,
	"an": true,
	"and": true,
	"any": true,
	"are": true,
	"aren't": true,
	"as": true,
	"at": true,
	"be": true,
	"because": true,
	"been": true,
	"before": true,
	"being": true,
	"below": true,
	"between": true,
	"both": true,
	"but": true,
	"by": true,
	"can't": true,
	"cannot": true,
	"could": true,
	"couldn't": true,
	"did": true,
	"didn't": true,
	"do": true,
	"does": true,
	"doesn't": true,
	"doing": true,
	"don't": true,
	"down": true,
	"during": true,
	"each": true,
	"few": true,
	"for": true,
	"from": true,
	"further": true,
	"had": true,
	"hadn't": true,
	"has": true,
	"hasn't": true,
	"have": true,
	"haven't": true,
	"having": true,
	"he": true,
	"he'd": true,
	"he'll": true,
	"he's": true,
	"her": true,
	"here": true,
	"here's": true,
	"hers": true,
	"herself": true,
	"him": true,
	"himself": true,
	"his": true,
	"how": true,
	"how's": true,
	"i": true,
	"i'd": true,
	"i'll": true,
	"i'm": true,
	"i've": true,
	"if": true,
	"in": true,
	"into": true,
	"is": true,
	"isn't": true,
	"it": true,
	"it's": true,
	"its": true,
	"itself": true,
	"let's": true,
	"me": true,
	"more": true,
	"most": true,
	"mustn't": true,
	"my": true,
	"myself": true,
	"no": true,
	"nor": true,
	"not": true,
	"of": true,
	"off": true,
	"on": true,
	"once": true,
	"only": true,
	"or": true,
	"other": true,
	"ought": true,
	"our": true,
	"ours": true,
	"ourselves": true,
	"out": true,
	"over": true,
	"own": true,
	"same": true,
	"shan't": true,
	"she": true,
	"she'd": true,
	"she'll": true,
	"she's": true,
	"should": true,
	"shouldn't": true,
	"so": true,
	"some": true,
	"such": true,
	"than": true,
	"that": true,
	"that's": true,
	"the": true,
	"their": true,
	"theirs": true,
	"them": true,
	"themselves": true,
	"then": true,
	"there": true,
	"there's": true,
	"these": true,
	"they": true,
	"they'd": true,
	"they'll": true,
	"they're": true,
	"they've": true,
	"this": true,
	"those": true,
	"through": true,
	"to": true,
	"too": true,
	"under": true,
	"until": true,
	"up": true,
	"very": true,
	"was": true,
	"wasn't": true,
	"we": true,
	"we'd": true,
	"we'll": true,
	"we're": true,
	"we've": true,
	"were": true,
	"weren't": true,
	"what": true,
	"what's": true,
	"when": true,
	"when's": true,
	"where": true,
	"where's": true,
	"which": true,
	"while": true,
	"who": true,
	"who's": true,
	"whom": true,
	"why": true,
	"why's": true,
	"with": true,
	"won't": true,
	"would": true,
	"wouldn't": true,
	"you": true,
	"you'd": true,
	"you'll": true,
	"you're": true,
	"you've": true,
	"your": true,
	"yours": true,
	"yourself": true,
	"yourselves": true
};