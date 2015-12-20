var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var config = require('../config.js');
var solrService = require('../services/solrService.js');

router.get('/', function(req,res,next) {
	var q = req.query.q;
	
	var model = {
		q: q
	};
	
	var db = pgp(config.connectionString);
	db.any("SELECT * FROM kssj_gesla WHERE iztocnica LIKE '%${iztocnica^}%'", {iztocnica:model.q})
		.then(function(data) {
			model.entries = data;
			res.render('results', model);
		});	
});

router.get('/autocomplete', function(req,res,next) {
    var q = req.query.q;
    
    solrService.getAutocompleteSuggestions(q, function(items) {
        res.json(items);        
    });
});

module.exports = router;