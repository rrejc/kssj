var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')();
var config = require('../config.js');
var entryService = require('../services/entryService.js');

router.get('/', function (req, res, next) {
	var q = req.query.q;
	var id = req.query.id;
	var sid = req.query.sid;

	entryService.getEntry(id, sid)
		.then(function (data) {
			data.q = q;
			data.id = id;
			res.render('entry', data);
		});
});

router.get('/collocation', function (req, res, next) {
	var q = req.query.q;
	var cid = req.query.cid;

	entryService.getCollocation(cid)
		.then(function (data) {
			data.q = q;
			res.render('collocation', data);
		});
});

module.exports = router;