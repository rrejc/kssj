var pgp = require('pg-promise')();
var config = require('../config.js');
var solrService = require('./solrService.js');
var collocationParser = require('../model/collocationParser.js');

var entryService = {

	getEntry: function(id, sid) {
		return new Promise(function(resolve) {
			var result = {};
			var db = pgp(config.connectionString);
			db.one('SELECT g.*, b.bes_vrsta FROM kssj_gesla g, sssj_bes_vrste b WHERE g.id_bes_vrste = b.id_bes_vrste AND id_gesla = ${id}', {id:id})
				.then(function(data) {
					result.headword = data.iztocnica;
					result.pos = data.bes_vrsta;
					return db.many('select id_strukture, vs.opis_html struktura from kssj_strukture s, kssj_vrste_strukture vs where s.id_vrste_strukture = vs.id_vrste_strukture and s.id_gesla= ${id}', {id:id});			
				})
				.then(function(data) {
					if (typeof sid === 'undefined') {
						sid = data[0].id_strukture;
					}
					result.structures = data;
					result.sid = sid;
					return db.many('SELECT * FROM kssj_kolokacije WHERE id_strukture = ${sid}', {sid:sid});
				})
				.then(function(data) {
					result.collocations = [];
					while (data.length) {
						var batch = data.splice(0,4);
						result.collocations.push(batch);						
					}
					resolve(result);
				})
				.catch(function(err) {
					throw err;
				});;		
		});
	},
	
	getCollocation: function(cid) {
		return new Promise(function(resolve) {
			var result = {};					
	
			var db = pgp(config.connectionString);
			var sql = 'SELECT k.*, vs.opis_html struktura FROM kssj_kolokacije k, kssj_strukture s, kssj_vrste_strukture vs WHERE k.id_strukture = s.id_strukture AND s.id_vrste_strukture = vs.id_vrste_strukture AND k.id_kolokacije = ${cid}';		
			
			db.one(sql, {cid:cid})
				.then(function(data) {
					result.collocation = collocationParser.toHtml(data.kolokacija);
					result.structure = data.struktura;
					return db.many('SELECT zgled_html FROM kssj_zgledi WHERE id_kolokacije = ${cid}', {cid:cid});
				})
				.then(function(data) {
					result.examples = data;
					resolve(result);
				})
				.catch(function(err) {
					throw err;
				});			
		});
	}
}

module.exports = entryService;