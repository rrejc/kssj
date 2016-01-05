var Kssj = {
    run: function() {
        Kssj.bindSearch();
    },
    
    bindSearch: function()  {
		var engine = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace,
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: '/search/autocomplete?q=%query',
				wildcard: '%query'
			}
		});
		$('#q').typeahead(null, {
			name: 'autocomplete',
			source: engine,
			displayKey: function(obj) {
				return obj;
			}
		});
		//$('#q').focus();
    }
}

$(Kssj.run);