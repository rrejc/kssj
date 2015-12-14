var S = require('string');

var structureParser = {
	toString: function(structure) {
		var parsed = structure;
		parsed = S(parsed).replaceAll(' ', ' + ').s;
		parsed = S(parsed).replaceAll('sbz0', 'samostalnik (0)').s;
		parsed = S(parsed).replaceAll('sbz1', 'samostalnik (1)').s;
		parsed = S(parsed).replaceAll('sbz2', 'samostalnik (2)').s;
		parsed = S(parsed).replaceAll('sbz3', 'samostalnik (3)').s;
		parsed = S(parsed).replaceAll('sbz4', 'samostalnik (4)').s;
		parsed = S(parsed).replaceAll('sbz5', 'samostalnik (5)').s;
		parsed = S(parsed).replaceAll('sbz6', 'samostalnik (6)').s;
		parsed = S(parsed).replaceAll('pbz0', 'pridevnik (0)').s;
		parsed = S(parsed).replaceAll('pbz1', 'pridevnik (1)').s;
		parsed = S(parsed).replaceAll('pbz2', 'pridevnik (2)').s;
		parsed = S(parsed).replaceAll('pbz3', 'pridevnik (3)').s;
		parsed = S(parsed).replaceAll('pbz4', 'pridevnik (4)').s;
		parsed = S(parsed).replaceAll('pbz5', 'pridevnik (5)').s;
		parsed = S(parsed).replaceAll('pbz6', 'pridevnik (6)').s;
		parsed = S(parsed).replaceAll('gbz', 'glagol').s;
		parsed = S(parsed).replaceAll('rbz', 'prislov').s;
		parsed = S(parsed).replaceAll('SBZ0', 'samostalnik (0)').s;
		parsed = S(parsed).replaceAll('SBZ1', 'samostalnik (1)').s;
		parsed = S(parsed).replaceAll('SBZ2', 'samostalnik (2)').s;
		parsed = S(parsed).replaceAll('SBZ3', 'samostalnik (3)').s;
		parsed = S(parsed).replaceAll('SBZ4', 'samostalnik (4)').s;
		parsed = S(parsed).replaceAll('SBZ5', 'samostalnik (5)').s;
		parsed = S(parsed).replaceAll('SBZ6', 'samostalnik (6)').s;
		parsed = S(parsed).replaceAll('SBZ0', 'pridevnik (0)').s;
		parsed = S(parsed).replaceAll('PBZ1', 'pridevnik (1)').s;
		parsed = S(parsed).replaceAll('PBZ2', 'pridevnik (2)').s;
		parsed = S(parsed).replaceAll('PBZ3', 'pridevnik (3)').s;
		parsed = S(parsed).replaceAll('PBZ4', 'pridevnik (4)').s;
		parsed = S(parsed).replaceAll('PBZ5', 'pridevnik (5)').s;
		parsed = S(parsed).replaceAll('PBZ6', 'pridevnik (6)').s;
		parsed = S(parsed).replaceAll('GBZ', 'glagol').s;
		parsed = S(parsed).replaceAll('RBZ', 'prislov').s;
		return parsed;
	}
}

module.exports = structureParser;