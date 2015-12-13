var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://ks:ks123@localhost/ks'

router.get('/', function(req,res,next) {
	var q = req.query.q;
	var id = req.query.id;
	var entry = {};
	
	pg.connect(connectionString, function(err, client, done) {
		if (err) {
			return console.error('Error fetching client from pool', err);
		}
		client.query('SELECT * FROM kssj_gesla WHERE id_gesla = $1', [id], function(err, result) {
			done();
			
			if (err) {
				return console.error('Error running query', err);
			}
			entry = result.rows[0];
			res.render('entry', {q: q, entry: entry});
		});
	});
	
	
});

module.exports = router;