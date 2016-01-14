var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	var data = {
		bodyClass: 'index'
	}
	res.render('index', data);
});

module.exports = router;