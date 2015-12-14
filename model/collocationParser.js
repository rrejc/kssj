var sax = require('sax');

var collocationParser = {	
	toHtml: function(collocation) {
		var saxParser = sax.parser(true);		
		var html = '';
		
		saxParser.ontext = function(t) {
			html = html + t;
		}
		saxParser.onopentag = function(node) {
			if (node.name === 'k') {
				html = html + '<em>';
			} else if (node.name === 'i') {
				html = html + '<strong>';
			}
		}
		saxParser.onclosetag = function(tag) {
			if (tag === 'k') {
				html = html + '</em>';
			} else if (tag === 'i') {
				html = html + '</strong>';
			}			
		}		
		saxParser.write('<dummy>' + collocation + '</dummy>').close();
		return html;					
	}			
}

module.exports = collocationParser;