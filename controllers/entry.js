var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var config = require('../config.js');
var exampleParser = require('../model/exampleParser.js');
var collocationParser = require('../model/collocationParser.js');
var structureParser = require('../model/structureParser.js');

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
			model.structures.forEach(function(structure) {
				structure.struktura = structureParser.toString(structure.struktura);
			});			
			model.sid = sid;
			return db.many('SELECT * FROM kssj_kolokacije WHERE id_gesla = ${id} AND id_strukture = ${sid}', {id:id, sid:sid});
		})
		.then(function(data) {
			model.collocations = data;
			model.collocations.forEach(function(collocation) {
				collocation.kolokacija = collocationParser.toHtml(collocation.kolokacija);
			});
			res.render('entry', model);
		});
});

router.get('/collocation', function(req,res,next) {
	var q = req.query.q;
	var id = req.query.id;
	var cid = req.query.cid;
	
	var model = {
		q: q,
		id: id
	};
	
	var db = pgp(config.connectionString);
	db.one('SELECT k.*, s.struktura FROM kssj_kolokacije k, kssj_strukture s WHERE k.id_strukture = s.id_strukture AND k.id_kolokacije = ${cid}', {cid:cid})
		.then(function(data) {
			model.collocation = collocationParser.toHtml(data.kolokacija);
			model.structure = structureParser.toString(data.struktura);
			return db.many('SELECT * FROM kssj_zgledi WHERE id_kolokacije = ${cid}', {cid:cid});
		})
		.then(function(data) {
			model.examples = data;
			model.examples.forEach(function(example) {
				example.zgled = exampleParser.toHtml(example.zgled);
			});
			res.render('collocation', model);
		})
		.catch(function(error) {
			console.error(error);
		});
});

module.exports = router;