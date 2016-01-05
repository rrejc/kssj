var express = require('express');
var router = express.Router();
var searchService = require('../services/searchService.js');

router.get('/', function (req, res, next) {
	var q = req.query.q;
	
	if (q) {
		var page = req.query.p || 1;

		searchService.search(q, page, 20)
			.then(function (results) {
				results.q = q;
				res.render('results', results);
			});
	} else {
		// Redirect to index
		res.redirect('/');
	}
});

router.get('/autocomplete', function (req, res, next) {
    var q = req.query.q;

	searchService.autocomplete(q, function (items) {
		res.json(items);
	});
});

module.exports = router;