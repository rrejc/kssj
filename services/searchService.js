var pgp = require('pg-promise')();
var config = require('../config.js');
var solrService = require('./solrService.js');
var collocationParser = require('../model/collocationParser.js');

var searchService = {	
	// Autocomplete when searching
	autocomplete: function(query, callback) {
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
		solrService.select(qs, function(response) {
			var facets = response.facet_counts.facet_fields.autocomplete;
			var items = [];
			for (var i=0;i<facets.length;i++) {
				if (i % 2==0) {
					items.push(facets[i])
				}
			}               
			callback(items);      						
		});			
	},		
	
	// Search
	search: function(query, page, pageSize) {
		return new Promise(function(resolve) {
			
			var qs = {
				q: 'content:(' + query + ')',
				start: (page-1)*pageSize,
				rows: pageSize,
				wt: 'json'
			}
			solrService.select(qs, function(response) {
				console.log(response);
				var result = {};
				result.headwords = [];
				result.collocations = [];			
				
				result.numFound = response.response.numFound;
				result.page = page;
				result.pageSize = pageSize;
				
				var headwords = [];
				var collocations = [];
				
				var docs = response.response.docs;
				if (docs.length === 0) {
					resolve(result);
				}
				
				for (var i=0;i<docs.length;i++) {
					var doc = docs[i];
					if (doc.type === 1) {
						headwords.push(doc.entry_id);
					} else if (doc.type === 2) {
						collocations.push(doc.collocation_id);
					}
				}
				

				var db = pgp(config.connectionString);
				db.any('SELECT id_gesla, iztocnica FROM kssj_gesla WHERE id_gesla IN ($1^)', pgp.as.csv(headwords))
				.then(function(data) {
					result.headwords = data;
					return db.any('SELECT g.id_gesla, g.iztocnica, k.id_kolokacije, k.kolokacija FROM kssj_kolokacije k, kssj_gesla g WHERE k.id_gesla = g.id_gesla AND k.id_kolokacije IN ($1^)', pgp.as.csv(collocations))
				})
				.then(function(data) {
					result.collocations = data;
					result.collocations.forEach(function(collocation) {
						collocation.kolokacija = collocationParser.toHtml(collocation.kolokacija);
					});
					resolve(result);
				})
				.catch(function(err) {
					throw err;
				});;	
			});			
			
		});
		

	},
}

module.exports = searchService;