var express = require('express');
var path = require('path');
var app = express();

var index = require('./controllers/index');
var search = require('./controllers/search');
var entry = require('./controllers/entry');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use('/', index);
app.use('/search', search);
app.use('/entry', entry);

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening at http://%s:%s', host, port);
});
