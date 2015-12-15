var S = require('string');

var structureParser = {
	toString: function(structure) {
		var parsed = structure;
		parsed = S(parsed).replaceAll(' ', ' + ').s;
		parsed = S(parsed).replaceAll('sbz0', '<em>samostalnik (0)</em>').s;
		parsed = S(parsed).replaceAll('sbz1', '<em>samostalnik (1)</em>').s;
		parsed = S(parsed).replaceAll('sbz2', '<em>samostalnik (2</em>)').s;
		parsed = S(parsed).replaceAll('sbz3', '<em>samostalnik (3</em>)').s;
		parsed = S(parsed).replaceAll('sbz4', '<em>samostalnik (4</em>)').s;
		parsed = S(parsed).replaceAll('sbz5', '<em>samostalnik (5)</em>').s;
		parsed = S(parsed).replaceAll('sbz6', '<em>samostalnik (6)</em>').s;
		parsed = S(parsed).replaceAll('pbz0', '<em>pridevnik (0)</em>').s;
		parsed = S(parsed).replaceAll('pbz1', '<em>pridevnik (1)</em>').s;
		parsed = S(parsed).replaceAll('pbz2', '<em>pridevnik (2)</em>').s;
		parsed = S(parsed).replaceAll('pbz3', '<em>pridevnik (3)</em>').s;
		parsed = S(parsed).replaceAll('pbz4', '<em>pridevnik (4)</em>').s;
		parsed = S(parsed).replaceAll('pbz5', '<em>pridevnik (5</em>').s;
		parsed = S(parsed).replaceAll('pbz6', '<em>pridevnik (6)</em>').s;
		parsed = S(parsed).replaceAll('gbz', '<em>glagol</em>').s;
		parsed = S(parsed).replaceAll('rbz', '<em>prislov</em>').s;
		parsed = S(parsed).replaceAll('SBZ0', '<strong>samostalnik (0)</strong>').s;
		parsed = S(parsed).replaceAll('SBZ1', '<strong>samostalnik (1)</strong>').s;
		parsed = S(parsed).replaceAll('SBZ2', '<strong>samostalnik (2)</strong>').s;
		parsed = S(parsed).replaceAll('SBZ3', '<strong>samostalnik (3)</strong>').s;
		parsed = S(parsed).replaceAll('SBZ4', '<strong>samostalnik (4)</strong>').s;
		parsed = S(parsed).replaceAll('SBZ5', '<strong>samostalnik (5)</strong>').s;
		parsed = S(parsed).replaceAll('SBZ6', '<strong>samostalnik (6)</strong>').s;
		parsed = S(parsed).replaceAll('SBZ0', '<strong>pridevnik (0)</strong>').s;
		parsed = S(parsed).replaceAll('PBZ1', '<strong>pridevnik (1)</strong>').s;
		parsed = S(parsed).replaceAll('PBZ2', '<strong>pridevnik (2)</strong>').s;
		parsed = S(parsed).replaceAll('PBZ3', '<strong>pridevnik (3)</strong>').s;
		parsed = S(parsed).replaceAll('PBZ4', '<strong>pridevnik (4)</strong>').s;
		parsed = S(parsed).replaceAll('PBZ5', '<strong>pridevnik (5)</strong>').s;
		parsed = S(parsed).replaceAll('PBZ6', '<strong>pridevnik (6)</strong>').s;
		parsed = S(parsed).replaceAll('GBZ', '<strong>glagol</strong>').s;
		parsed = S(parsed).replaceAll('RBZ', '<strong>prislov</strong>').s;
		return parsed;
	}
}

module.exports = structureParser;