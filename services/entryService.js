var pgp = require('pg-promise')();
var config = require('../config.js');
var solrService = require('./solrService.js');
var collocationParser = require('../model/collocationParser.js');
var structureParser = require('../model/structureParser.js');

var entryService = {

	getEntry: function(id, sid) {
		return new Promise(function(resolve) {
			var result = {};
			var db = pgp(config.connectionString);
			db.one('SELECT g.*, b.bes_vrsta FROM kssj_gesla g, sssj_bes_vrste b WHERE g.id_bes_vrste = b.id_bes_vrste AND id_gesla = ${id}', {id:id})
				.then(function(data) {
					result.headword = data.iztocnica;
					result.pos = data.bes_vrsta;
					return db.many('SELECT * FROM kssj_strukture WHERE id_gesla = ${id}', {id:id});			
				})
				.then(function(data) {
					if (typeof sid === 'undefined') {
						sid = data[0].id_strukture;
					}
					result.structures = data;
					result.structures.forEach(function(structure) {
						structure.struktura = structureParser.toString(structure.struktura);
					});			
					result.sid = sid;
					return db.many('SELECT * FROM kssj_kolokacije WHERE id_gesla = ${id} AND id_strukture = ${sid}', {id:id, sid:sid});
				})
				.then(function(data) {
					result.collocations = [];
					var batch = [];
					for (var i=0;i<data.length;i++) {
						batch.push(data[i]);
						if (i%4==0) {
							// Get collocators
							batch = [];
						}
					}
					
					
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
	}
	
	
	
}

module.exports = entryService;