var express = require('express');
var router = express.Router();
var entryService = require('../services/entryService.js');

// Entry
router.get('/', function (req, res, next) {
    var q = req.query.q;
    var id = req.query.id;
    var sid = req.query.sid;

    entryService.getEntry(id, sid)
        .then(function (data) {
            data.q = q;
            data.id = id;
            data.bodyClass = 'entry';
            res.render('entry', data);
        }, function(reason) {
            res.status(404).send('Geslo ne obstaja!');
        });
});

// Collocation
router.get('/collocation', function (req, res, next) {
    var q = req.query.q;
    var cid = req.query.cid;

    entryService.getCollocation(cid)
        .then(function (data) {
            data.q = q;
            data.bodyClass = 'collocation';
            res.render('collocation', data);
        }, function(reason) {
            res.status(404).send('Kolokacija ne obstaja!');
        });
});

module.exports = router;