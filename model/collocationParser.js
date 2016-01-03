var collocationParser = {	
	toHtml: function(collocation) {
		var obj = JSON.parse(collocation);
		
		var html = '';
		for (var i = 0; i<obj.data.length; i++) {
			if (html.length > 0) {
				html = html + ' ';
			}
			
			var item = obj.data[i];
			if (item.name === 'i') {
				html = html + '<strong>' + item.value + '</strong>';
			} else if (item.name === 'k') {
				html = html + '<em>' + item.value + '</em>';
			} else {
				html = html + item.value;
			}
		}
		return html.trim();					
	}		
}

module.exports = collocationParser;