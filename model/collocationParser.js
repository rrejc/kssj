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
			} else if (node.name === 'v') {
				html = html + ' / '
			};
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
	},
	
	toPlainText: function(collocation) {
		var saxParser = sax.parser(true);
		var plain = '';
				
		saxParser.ontext = function(t) {
			var trimmed = t.trim();
			if (trimmed !== '') {
				plain = plain + t + ' ';
			}
		}
		saxParser.write('<dummy>' + collocation + '</dummy>').close();
		return plain.trim();
	}			
}

module.exports = collocationParser;