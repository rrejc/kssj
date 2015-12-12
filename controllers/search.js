var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://ks:ks123@localhost/ks'

router.get('/', function(req,res,next) {
	var q = req.query.q;
	var entries = [];
	
	pg.connect(connectionString, function(err, client, done) {
		if (err) {
			return console.error('Error fetching client from pool', err);
		}
		var qLike = '%' + q + "%";
		client.query('SELECT * FROM kssj_gesla WHERE iztocnica LIKE $1', [qLike], function(err, result) {
			done();
			
			if (err) {
				return console.error('Error running query', err);
			}
			entries = result.rows;			
			res.render('results', {q: q, entries: entries});
		});
	});
	
	
});

module.exports = router;