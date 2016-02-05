var express = require('express');
var router = express.Router();
var searchService = require('../services/searchService.js');

router.get('/', function (req, res, next) {
    var q = req.query.q;
    
    if (q) {
        var page = req.query.p || 1;

        searchService.search(q, page, 20)
            .then(function (data) {
                data.q = q;
                data.bodyClass = 'results';
                res.render('results', data);
            }, function(reason) {
                console.error(reason);
                res.redirect('/');
            });
    } else {
        // Redirect to index
        res.redirect('/');
    }
});

router.get('/autocomplete', function (req, res, next) {
    var q = req.query.q;
    
    if (q) {
        searchService.autocomplete(q)
            .then(function(data) {
                res.json(data);
            }, function(reason) {
                console.error(reason);
                res.json([]);
            });
    } else {
        res.json([]);
    }
});

module.exports = router;