var process = require('process');

var config = {
	connectionString: process.env.PG_CONN
}

module.exports = config;