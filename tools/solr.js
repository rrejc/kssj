var pgp = require('pg-promise')();
var QueryStream = require('pg-query-stream');
var uuid = require('node-uuid');
var config = require('../config.js');
var http = require('http');
var agent = http.Agent();

var db = pgp(config.connectionString);

var qs = new QueryStream('SELECT * FROM kssj_gesla');
var documents = [];
db.stream(qs, function(s) {
	s.on('data', function(data) {
		documents.push({id: uuid.v4(), entry_id: data.id_gesla, type: 1, content: data.iztocnica});
		if (documents.length === 100) {
			// http://stackoverflow.com/questions/18319823/batch-requests-in-node-js
			// https://nodejs.org/dist/latest-v4.x/docs/api/http.html
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
			documents = [];
		}		
		//console.log("Headword " + data.iztocnica);
	})
});

