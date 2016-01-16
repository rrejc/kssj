var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	var data = {
		bodyClass: 'about'
	}
	res.render('about', data);
});

module.exports = router;