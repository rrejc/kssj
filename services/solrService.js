var http = require('http');
var querystring = require('querystring');

var solrService = {
	addDocuments: function(documents) {
		var agent = http.Agent();
	
		var json = JSON.stringify(documents);
			
		var options = {
			host: 'localhost',
			port: 8080,
			path: '/solr/kssj/update/json',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			agent: agent		
		};
		var req = http.request(options, function(res) {
			console.log('Response status: ' + res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('Response body: ' + chunk);
			});
		});
		req.on('error', function(e) {
			console.log('Problem with request', e.message);
		});
		req.write(json);
		req.end();			
	},
	
	select: function(qs, callback) {		
		var options = {
			host: 'localhost',
			port: 8080,
			path: '/solr/kssj/select?' + querystring.stringify(qs),
			method: 'GET'			
		};
		var req = http.request(options, function(res) {
			var body = '';
			res.on('data', function(chunk) {
				console.log('rsponse data');
				body += chunk;
			});
			res.on('end', function() {
					console.log('rsponse end');
				var json = JSON.parse(body);
				return callback(json);
			})
		}).
		on('error', function(e) {
			console.log(e);
		});		
		req.end();
	},
	
	get: function(path, qs, callback) {
		
	}	
}

module.exports = solrService;