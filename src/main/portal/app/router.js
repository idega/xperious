define([
	'app',
	'view/index/IndexView',
	'view/search/SearchView'],
function(
	app,
	IndexView,
	SearchView) {

	return Backbone.Router.extend({

	    routes: {
	    	'search/:query/:country/:from/:to/:guests' : 'search',
	    	'search/:country/:from/:to/:guests' : 'searchAll',
	    	'*path': 'index'
	    },


	    initialize: function() {
	    },


	    search: function(query, country, from, to, guests) {
	    	var layout = app.layout();
	    	layout.setView('#content', new SearchView());
	    	layout.render();
	    },
	    

	    searchAll: function(country, from, to, guests) {
	    	this.search('', country, from, to, guests);
	    },


	    index: function() {
	    	var layout = app.layout();
	    	layout.setView('#content', new IndexView());
	    	layout.render();
	    },
	    

	    /**
	     * Comfort method to create URLs more easily.
	     */
	    go: function() {
	    	return this.navigate(
	    			_.map(
	    				_.toArray(arguments), 
	    				function(arg) { 
	    					return encodeURIComponent(arg); 
	    				})
	    			.join("/")
	    			.replace('//', '/'), 
    			{trigger: true});
	    }
	});

});
