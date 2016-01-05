var pgp = require('pg-promise')();
var QueryStream = require('pg-query-stream');
var config = require('../config.js');
var uuid = require('node-uuid');

var solrService = require('../services/solrService.js');

var db = pgp(config.connectionString);

var qs = new QueryStream('SELECT id_gesla, iztocnica FROM kssj_gesla');
db.stream(qs, function (s) {
	var documents = [];
	s.on('data', function (data) {
		documents.push({ id: uuid.v4(), entry_id: data.id_gesla, type: 1, content: data.iztocnica });
		if (documents.length === 100) {
			solrService.addDocuments(documents);
			documents = [];
		}
	})
});

var qs2 = new QueryStream('SELECT id_kolokacije, id_gesla, kolokacija_text FROM kssj_kolokacije');
db.stream(qs2, function (s) {
	var documents = [];
	s.on('data', function (data) {
		documents.push({ id: uuid.v4(), entry_id: data.id_gesla, collocation_id: data.id_kolokacije, type: 2, content: data.kolokacija_text })
		if (documents.length === 100) {
			solrService.addDocuments(documents);
			documents = [];
		}
	});
});
