var solrService = require('./solrService.js');

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
			console.log(response);
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
	search: function(query, page, pageSize, callback) {
		var qs = {
			q: 'content:(' + query + ')',
			start: (page-1)*pageSize,
			rows: pageSize
		}
		solrService.select(qs, function(response) {
			
		});
	},
}

module.exports = searchService;