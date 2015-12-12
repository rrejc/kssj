var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next) {
	var q = req.query.q;
	
	res.render('results', {q: q});
});

module.exports = router;