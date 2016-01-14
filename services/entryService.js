var pgp = require('pg-promise')();
var config = require('../config.js');
var solrService = require('./solrService.js');

var entryService = {

	getEntry: function (id, sid) {
		return new Promise(function (resolve, reject) {
			var db = pgp(config.connectionString);

			var sql1 = 'SELECT g.iztocnica, b.bes_vrsta FROM kssj_gesla g, sssj_bes_vrste b WHERE g.id_bes_vrste = b.id_bes_vrste AND id_gesla = ${id}';
			var p1 = db.one(sql1, { id: id });

			var sql2 = 'select id_strukture, vs.opis_html struktura from kssj_strukture s, kssj_vrste_strukture vs where s.id_vrste_strukture = vs.id_vrste_strukture and s.id_gesla= ${id}';
			var p2 = db.many(sql2, { id: id });

			if (typeof sid === 'undefined') {
				var sql3 = 'SELECT * FROM kssj_kolokacije WHERE id_strukture = (SELECT id_strukture FROM kssj_strukture WHERE id_gesla = ${id} ORDER BY zap_st LIMIT 1)';
				var p3 = db.many(sql3, { id: id });
			} else {
				var sql3 = 'SELECT * FROM kssj_kolokacije WHERE id_strukture = ${sid}';
				var p3 = db.many(sql3, { sid: sid });
			}

			Promise.all([p1, p2, p3]).then(function (values) {
				// Batch collocations
				var collocations = [];
				while (values[2].length) {
					var batch = values[2].splice(0, 4);
					collocations.push(batch);
				}
				
				// Get real sid
				var realSid = (typeof sid != 'undefined') ? sid : values[1][0].id_strukture;
				
				// Get real structure
				var structure =  values[1].filter(function(s) {
					return s.id_strukture === realSid;
				})[0];
				console.log(structure);

				var result = {
					headword: values[0].iztocnica,
					pos: values[0].bes_vrsta,
					structures: values[1],
					collocations: collocations,
					structure: structure,
					sid: realSid
				};
				resolve(result);
			}, function (reason) {
				reject(reason);
			});
		});
	},

	getCollocation: function (cid) {
		return new Promise(function (resolve, reject) {
			var db = pgp(config.connectionString);

			var sql1 = 'SELECT g.id_gesla, g.iztocnica, bs.bes_vrsta, vs.opis_html struktura, k.kolokacija FROM kssj_kolokacije k, kssj_gesla g, sssj_bes_vrste bs, kssj_strukture s, kssj_vrste_strukture vs WHERE k.id_gesla = g.id_gesla AND g.id_bes_vrste = bs.id_bes_vrste AND k.id_strukture = s.id_strukture  AND s.id_vrste_strukture = vs.id_vrste_strukture AND k.id_kolokacije = ${cid}';			
			//var sql1 = 'SELECT k.*, vs.opis_html struktura FROM kssj_kolokacije k, kssj_strukture s, kssj_vrste_strukture vs WHERE k.id_strukture = s.id_strukture AND s.id_vrste_strukture = vs.id_vrste_strukture AND k.id_kolokacije = ${cid}';
			var p1 = db.one(sql1, { cid: cid });

			var sql2 = 'SELECT zgled_html FROM kssj_zgledi WHERE id_kolokacije = ${cid}';
			var p2 = db.many(sql2, { cid: cid });

			Promise.all([p1, p2]).then(function (values) {
				var result = {
					id: values[0].id_gesla,
					headword: values[0].iztocnica,
					pos: values[0].bes_vrsta,
					collocation: values[0].kolokacija,
					structure: values[0].struktura,
					examples: values[1]
				};
				resolve(result);
			}, function (reason) {
				console.log(reason);
				reject(reason);
			});
		});
	}
}

module.exports = entryService;