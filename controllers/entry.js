var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var config = require('../config.js');
var exampleParser = require('../model/exampleParser.js');
var collocationParser = require('../model/collocationParser.js');

router.get('/', function(req,res,next) {
	var q = req.query.q;
	var id = req.query.id;
	var sid = req.query.sid;
	
	var model = {
		q: q,
		id: id
	};
	
	var db = pgp(config.connectionString);
	db.one('SELECT g.*, b.bes_vrsta FROM kssj_gesla g, sssj_bes_vrste b WHERE g.id_bes_vrste = b.id_bes_vrste AND id_gesla = ${id}', {id:id})
		.then(function(data) {
			model.headword = data.iztocnica;
			model.pos = data.bes_vrsta;
			return db.many('SELECT * FROM kssj_strukture WHERE id_gesla = ${id}', {id:id});			
		})
		.then(function(data) {
			if (typeof sid === 'undefined') {
				sid = data[0].id_strukture;
			}
			model.structures = data;
			model.sid = sid;
			return db.many('SELECT * FROM kssj_kolokacije WHERE id_gesla = ${id} AND id_strukture = ${sid}', {id:id, sid:sid});
		})
		.then(function(data) {
			model.collocations = data;
			return db.many('SELECT * FROM kssj_zgledi WHERE id_gesla = ${id} AND id_strukture = ${sid}', {id:id, sid:sid});						
		})
		.then(function(examples) {
			model.collocations.forEach(function(collocation) {
				collocation.kolokacija = collocationParser.toHtml(collocation.kolokacija);
				collocation.examples = [];
				examples.forEach(function(example) {
					if (example.id_kolokacije === collocation.id_kolokacije) {
						//collocation.examples.push(example2Html(example.zgled));
						collocation.examples.push(exampleParser.toHtml(example.zgled));
					}
				});
			});
			res.render('entry', model);
		});	
});

module.exports = router;