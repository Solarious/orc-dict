'use strict';

module.exports = {
	cardinalDataCsvEop: cardinalDataCsvEop,
	cardinalDataTsvEop: cardinalDataTsvEop,
	cardinalDataCsvOpe: cardinalDataCsvOpe,
	cardinalDataTsvOpe: cardinalDataTsvOpe,
	cardinalWords: cardinalWords,
	cardinalWordsDuplicate: cardinalWordsDuplicate,
	cardinalWordsUnique: cardinalWordsUnique,
	cardinalWordsError: cardinalWordsError,
	cardinalMinDataCsvEop: cardinalMinDataCsvEop,
	cardinalMinYayDataCsvEop: cardinalMinYayDataCsvEop,
	errorDataCsvEop: errorDataCsvEop,
	lessthan3DataCsvEop: lessthan3DataCsvEop,
	emptyLinesDataCsvEop: emptyLinesDataCsvEop
};

function cardinalDataCsvEop() {
	var a = '';
	a += '"one","nul","cardinal"\n';
	a += '"two","solu","cardinal"\n';
	a += '"three","thaen","cardinal"\n';
	a += '"four","lex","cardinal"\n';
	a += '"five","stel","cardinal"\n';
	a += '"six","grae","cardinal"\n';
	a += '"seven","milz","cardinal","n.a.","Mills"\n';
	a += '"eight","roi","cardinal","c.b.","Jim Wrench"\n';
	a += '"nine","gluk","cardinal","n.a.","Glook","c.b.","Michael Delaune"\n';
	a += '"ten","lotta","cardinal","n.a.c.b.","Lotta Djerf"\n';
	a += '"eleven","ked","cardinal","d.f.","Test Value"\n';
	a += '"twelve","zwek","cardinal"\n';
	a += '"hundred","tuhu","cardinal"\n';
	a += '"thousand","yonda","cardinal"\n';
	a += '"million","alegin","cardinal"\n';
	return a;
}

function cardinalDataTsvEop() {
	var a = '';
	a += 'one\tnul\tcardinal\n';
	a += 'two\tsolu\tcardinal\n';
	a += 'three\tthaen\tcardinal\n';
	a += 'four\tlex\tcardinal\n';
	a += 'five\tstel\tcardinal\n';
	a += 'six\tgrae\tcardinal\n';
	a += 'seven\tmilz\tcardinal\tn.a.\tMills\n';
	a += 'eight\troi\tcardinal\tc.b.\tJim Wrench\n';
	a += 'nine\tgluk\tcardinal\tn.a.\tGlook\tc.b.\tMichael Delaune\n';
	a += 'ten\tlotta\tcardinal\tn.a.c.b.\tLotta Djerf\n';
	a += 'eleven\tked\tcardinal\td.f.\tTest Value\n';
	a += 'twelve\tzwek\tcardinal\n';
	a += 'hundred\ttuhu\tcardinal\n';
	a += 'thousand\tyonda\tcardinal\n';
	a += 'million\talegin\tcardinal\n';
	return a;
}

function cardinalDataCsvOpe() {
	var a = '';
	a += '"nul","cardinal","one"\n';
	a += '"solu","cardinal","two"\n';
	a += '"thaen","cardinal","three"\n';
	a += '"lex","cardinal","four"\n';
	a += '"stel","cardinal","five"\n';
	a += '"grae","cardinal","six"\n';
	a += '"milz","cardinal","seven","n.a.","Mills"\n';
	a += '"roi","cardinal","eight","c.b.","Jim Wrench"\n';
	a += '"gluk","cardinal","nine","n.a.","Glook","c.b.","Michael Delaune"\n';
	a += '"lotta","cardinal","ten","n.a.c.b.","Lotta Djerf"\n';
	a += '"ked","cardinal","eleven","d.f.","Test Value"\n';
	a += '"zwek","cardinal","twelve"\n';
	a += '"tuhu","cardinal","hundred"\n';
	a += '"yonda","cardinal","thousand"\n';
	a += '"alegin","cardinal","million"\n';
	return a;
}

function cardinalDataTsvOpe() {
	var a = '';
	a += 'nul\tcardinal\tone\n';
	a += 'solu\tcardinal\ttwo\n';
	a += 'thaen\tcardinal\tthree\n';
	a += 'lex\tcardinal\tfour\n';
	a += 'stel\tcardinal\tfive\n';
	a += 'grae\tcardinal\tsix\n';
	a += 'milz\tcardinal\tseven\tn.a.\tMills\n';
	a += 'roi\tcardinal\teight\tc.b.\tJim Wrench\n';
	a += 'gluk\tcardinal\tnine\tn.a.\tGlook\tc.b.\tMichael Delaune\n';
	a += 'lotta\tcardinal\tten\tn.a.c.b.\tLotta Djerf\n';
	a += 'ked\tcardinal\televen\td.f.\tTest Value\n';
	a += 'zwek\tcardinal\ttwelve\n';
	a += 'tuhu\tcardinal\thundred\n';
	a += 'yonda\tcardinal\tthousand\n';
	a += 'alegin\tcardinal\tmillion\n';
	return a;
}

function cardinalWords() {
	return [
		{
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'thaen',
			english: 'three',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'lex',
			english: 'four',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'stel',
			english: 'five',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'grae',
			english: 'six',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'milz',
			english: 'seven',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Mills'
		},
		{
			orcish: 'roi',
			english: 'eight',
			PoS: 'cardinal',
			num: 1,
			coinedBy: 'Jim Wrench'
		},
		{
			orcish: 'gluk',
			english: 'nine',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Glook',
			coinedBy: 'Michael Delaune'
		},
		{
			orcish: 'lotta',
			english: 'ten',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Lotta Djerf',
			coinedBy: 'Lotta Djerf'
		},
		{
			orcish: 'ked',
			english: 'eleven',
			PoS: 'cardinal',
			num: 1,
			extraInfo: 'Derived from: Test Value'
		},
		{
			orcish: 'zwek',
			english: 'twelve',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'tuhu',
			english: 'hundred',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'yonda',
			english: 'thousand',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'alegin',
			english: 'million',
			PoS: 'cardinal',
			num: 1
		},
	];
}

function cardinalWordsDuplicate() {
	return [
		{
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal',
			num: 2
		},
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'thaen',
			english: 'three',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'lex',
			english: 'four',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'stel',
			english: 'five',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'grae',
			english: 'six',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'milz',
			english: 'seven',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Mills'
		},
		{
			orcish: 'roi',
			english: 'eight',
			PoS: 'cardinal',
			num: 1,
			coinedBy: 'Jim Wrench'
		},
		{
			orcish: 'gluk',
			english: 'nine',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Glook',
			coinedBy: 'Michael Delaune'
		},
		{
			orcish: 'lotta',
			english: 'ten',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Lotta Djerf',
			coinedBy: 'Lotta Djerf'
		},
		{
			orcish: 'ked',
			english: 'eleven',
			PoS: 'cardinal',
			num: 1,
			extraInfo: 'Derived from: Test Value'
		},
		{
			orcish: 'zwek',
			english: 'twelve',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'tuhu',
			english: 'hundred',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'yonda',
			english: 'thousand',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'alegin',
			english: 'million',
			PoS: 'cardinal',
			num: 1
		},
	];
}

function cardinalWordsUnique() {
	return [
		{
			orcish: 'solu',
			english: 'two',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'thaen',
			english: 'three',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'lex',
			english: 'four',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'stel',
			english: 'five',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'grae',
			english: 'six',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'milz',
			english: 'seven',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Mills'
		},
		{
			orcish: 'roi',
			english: 'eight',
			PoS: 'cardinal',
			num: 1,
			coinedBy: 'Jim Wrench'
		},
		{
			orcish: 'gluk',
			english: 'nine',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Glook',
			coinedBy: 'Michael Delaune'
		},
		{
			orcish: 'lotta',
			english: 'ten',
			PoS: 'cardinal',
			num: 1,
			namedAfter: 'Lotta Djerf',
			coinedBy: 'Lotta Djerf'
		},
		{
			orcish: 'ked',
			english: 'eleven',
			PoS: 'cardinal',
			num: 1,
			extraInfo: 'Derived from: Test Value'
		},
		{
			orcish: 'zwek',
			english: 'twelve',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'tuhu',
			english: 'hundred',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'yonda',
			english: 'thousand',
			PoS: 'cardinal',
			num: 1
		},
		{
			orcish: 'alegin',
			english: 'million',
			PoS: 'cardinal',
			num: 1
		},
	];
}

function cardinalWordsError() {
	return [
		{
			orcish: 'nul',
			english: 'one',
			PoS: 'cardinal',
			num: 1
		}
	];
}

function cardinalMinDataCsvEop() {
	var a = '';
	a += '"three","thaen","cardinal"\n';
	a += '"four","lex","cardinal"\n';
	a += '"five","stel","cardinal"\n';
	return a;
}

function cardinalMinYayDataCsvEop() {
	var a = '';
	a += '"three yay","thaen","cardinal"\n';
	a += '"four","lex","cardinal"\n';
	a += '"five","stel","cardinal"\n';
	return a;
}

function errorDataCsvEop() {
	var a = '';
	a += '"one","nul","cardinal"\n';
	a += '"two","solu","cardinal"\n';
	a += '"three","thaen","cardinal"\n';
	a += '"four","lex","cardinal"\n';
	a += '"five","stel","cardinal"\n';
	a += '"six","grae","cardinal"\n';
	a += '"seven","milz","cardinal"\n';
	a += '"eight","roi","cardinal"\n';
	a += '"me","nudz","copular verb"\n';
	a += '"nine","gluk","cardinal"\n';
	a += '"ten","lotta","cardinal"\n';
	a += '"eleven","ked","cardinal"\n';
	a += '"twelve","zwek","cardinal"\n';
	a += '"hundred","tuhu","cardinal"\n';
	a += '"thousand","yonda","cardinal"\n';
	a += '"million","alegin","cardinal"\n';
	return a;
}

function lessthan3DataCsvEop() {
	var a = '';
	a += '"one","nul","cardinal"\n';
	a += '"two","solu","cardinal"\n';
	a += '"three","thaen","cardinal"\n';
	a += '"four","lex","cardinal"\n';
	a += '"five","stel","cardinal"\n';
	a += '"six","grae","cardinal"\n';
	a += '"seven","milz","cardinal"\n';
	a += '"eight","roi","cardinal"\n';
	a += '"me","nudz"\n';
	a += '"nine","gluk","cardinal"\n';
	a += '"ten","lotta","cardinal"\n';
	a += '"eleven","ked","cardinal"\n';
	a += '"twelve","zwek","cardinal"\n';
	a += '"hundred","tuhu","cardinal"\n';
	a += '"thousand","yonda","cardinal"\n';
	a += '"million","alegin","cardinal"\n';
	return a;
}

function emptyLinesDataCsvEop() {
	var a = '';
	a += '"one","nul","cardinal"\n';
	a += '"two","solu","cardinal"\n';
	a += '"three","thaen","cardinal"\n';
	a += '"four","lex","cardinal"\n';
	a += '\n';
	a += '"five","stel","cardinal"\n';
	a += '"six","grae","cardinal"\n';
	a += '"seven","milz","cardinal","n.a.","Mills"\n';
	a += '"eight","roi","cardinal","c.b.","Jim Wrench"\n';
	a += '"nine","gluk","cardinal","n.a.","Glook","c.b.","Michael Delaune"\n';
	a += '"ten","lotta","cardinal","n.a.c.b.","Lotta Djerf"\n';
	a += '\n';
	a += '"eleven","ked","cardinal","d.f.","Test Value"\n';
	a += '"twelve","zwek","cardinal"\n';
	a += '"hundred","tuhu","cardinal"\n';
	a += '"thousand","yonda","cardinal"\n';
	a += '\n';
	a += '"million","alegin","cardinal"\n';
	return a;
}
