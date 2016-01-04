var pgp = require('pg-promise')();
var config = require('../config.js');
var solrService = require('./solrService.js');

var entryService = {

	getEntry: function (id, sid) {
		return new Promise(function (resolve) {
			var result = {};
			var db = pgp(config.connectionString);
			
			/*
			var sql1 = 'SELECT g.*, b.bes_vrsta FROM kssj_gesla g, sssj_bes_vrste b WHERE g.id_bes_vrste = b.id_bes_vrste AND id_gesla = ${id}';
			var p1 = db.one(sql1, { id: id });
			
			var sql2 = 'select id_strukture, vs.opis_html struktura from kssj_strukture s, kssj_vrste_strukture vs where s.id_vrste_strukture = vs.id_vrste_strukture and s.id_gesla= ${id}';
			var p2 = db.many(sql2, { id: id });
			*/
			
			 
			
			db.one('SELECT g.*, b.bes_vrsta FROM kssj_gesla g, sssj_bes_vrste b WHERE g.id_bes_vrste = b.id_bes_vrste AND id_gesla = ${id}', { id: id })
				.then(function (data) {
					result.headword = data.iztocnica;
					result.pos = data.bes_vrsta;
					return db.many('select id_strukture, vs.opis_html struktura from kssj_strukture s, kssj_vrste_strukture vs where s.id_vrste_strukture = vs.id_vrste_strukture and s.id_gesla= ${id}', { id: id });
				})
				.then(function (data) {
					if (typeof sid === 'undefined') {
						sid = data[0].id_strukture;
					}
					result.structures = data;
					result.sid = sid;
					return db.many('SELECT * FROM kssj_kolokacije WHERE id_strukture = ${sid}', { sid: sid });
				})
				.then(function (data) {
					result.collocations = [];
					while (data.length) {
						var batch = data.splice(0, 4);
						result.collocations.push(batch);
					}
					resolve(result);
				})
				.catch(function (err) {
					throw err;
				});;
		});
	},

	getCollocation: function (cid) {
		return new Promise(function (resolve, reject) {
			var db = pgp(config.connectionString);

			var sql1 = 'SELECT k.*, vs.opis_html struktura FROM kssj_kolokacije k, kssj_strukture s, kssj_vrste_strukture vs WHERE k.id_strukture = s.id_strukture AND s.id_vrste_strukture = vs.id_vrste_strukture AND k.id_kolokacije = ${cid}';
			var p1 = db.one(sql1, { cid: cid });

			var sql2 = 'SELECT zgled_html FROM kssj_zgledi WHERE id_kolokacije = ${cid}';
			var p2 = db.many(sql2, { cid: cid });

			Promise.all([p1, p2]).then(function (values) {
				var result = {
					collocation: values[0].kolokacija,
					structure: values[0].struktura,
					examples: values[1]
				};
				resolve(result);
			}, function (reason) {
				reject(reason);
			});
		});
	}
}

module.exports = entryService;