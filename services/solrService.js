var http = require('http');

var solrService = {
    getAutocompleteSuggestions: function(query, callback) {
        //http://localhost:8080/solr/kssj/select?facet.field=autocomplete&facet.limit=10&facet.prefix=mi&facet.sort=count&facet=true&indent=on&q=*:*&rows=0&wt=json
        var url = 'http://localhost:8080/solr/kssj/select?facet.field=autocomplete&facet.limit=10&facet.prefix=' + query + '&facet.sort=count&facet=true&indent=on&q=*:*&rows=0&wt=json';
        http.get(url, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;    
            });
            res.on('end', function() {
               var bodyJson = JSON.parse(body);
               var facets = bodyJson.facet_counts.facet_fields.autocomplete;
               
               var items = [];
               for (var i=0;i<facets.length;i++) {
                   if (i % 2==0) {
                       items.push(facets[i])
                   }
               }               
               callback(items);      
            });
        })
        .on('error', function(e) {
            callback([]);                
        });
    }    
}

module.exports = solrService;