var pgp = require('pg-promise')();
var config = require('../config.js');
var solrService = require('./solrService.js');

var searchService = {	
	// Autocomplete when searching
	autocomplete: function (query, callback) {
		var qs = {
			q: '*:*',
			start: 0,
			rows: 0,
			facet: true,
			'facet.field': 'autocomplete',
			'facet.prefix': query,
			'facet.sort': 'count',
			'facet.limit': 10,
			wt: 'json'
		};
		solrService.select(qs, function (response) {
			var facets = response.facet_counts.facet_fields.autocomplete;
			var items = [];
			for (var i = 0; i < facets.length; i++) {
				if (i % 2 == 0) {
					items.push(facets[i])
				}
			}
			callback(items);
		});
	},		
	
	// Search
	search: function (query, page, pageSize) {
		return new Promise(function (resolve, reject) {
			var result = {};
			result.headwords = [];
			result.collocations = [];
			result.numFound = 0;
			result.page = page;
			result.pageSize = pageSize;

			if (!query) {
				resolve(result);
			} else {
				var qs = {
					q: '{!q.op=AND}content:(' + query + ')',
					start: (page - 1) * pageSize,
					rows: pageSize,
					wt: 'json'
				}
				solrService.select(qs, function (response) {
					result.numFound = response.response.numFound;

					var headwords = [];
					var collocations = [];

					var docs = response.response.docs;
					if (docs.length === 0) {
						resolve(result);
					}

					for (var i = 0; i < docs.length; i++) {
						var doc = docs[i];
						if (doc.type === 1) {
							headwords.push(doc.entry_id);
						} else if (doc.type === 2) {
							collocations.push(doc.collocation_id);
						}
					}

					var db = pgp(config.connectionString);

					// Entries
					var sql1 = 'SELECT id_gesla, iztocnica FROM kssj_gesla WHERE id_gesla IN ($1^)';
					var p1 = headwords.length > 0 ? db.any(sql1, pgp.as.csv(headwords)) : [];
				
					// Collocations
					var sql2 = 'SELECT g.id_gesla, g.iztocnica, k.id_kolokacije, k.kolokacija FROM kssj_kolokacije k, kssj_gesla g WHERE k.id_gesla = g.id_gesla AND k.id_kolokacije IN ($1^)';
					var p2 = collocations.length > 0 ? db.any(sql2, pgp.as.csv(collocations)) : [];

					Promise.all([p1, p2]).then(function (values) {
						result.headwords = values[0];
						result.collocations = values[1];
						resolve(result);
					}, function (reason) {
						reject(reason);
					});
				});
			}
		});
	}
}

module.exports = searchService;