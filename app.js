var express = require('express');
var path = require('path');
var app = express();

var index = require('./routes/index');
var search = require('./routes/search');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use('/', index);
app.use('/search', search);

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening at http://%s:%s', host, port);
});
