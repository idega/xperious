define([
	'app',
	'model/search/SearchPreferencesModel',
	'model/event/EventTimelineCollection',
	'model/plan/PlanCollection',
	'view/site/LoadingView',
	'view/index/IndexView',
	'view/search/SearchView'],
function(
	app,
	SearchPreferencesModel,
	EventTimelineCollection,
	PlanCollection,
	LoadingView,
	IndexView,
	SearchView) {

	return Backbone.Router.extend({

	    routes: {
	    	'search/:query/:country/:from/:to/:guests' : 'search',
	    	'search/:country/:from/:to/:guests' : 'searchAll',
	    	'*path': 'index'
	    },


	    initialize: function() {
	    	this.models = {};	    	
	    	this.collections = {};
	    	this.views = {};

	    	this.models.preferences = new SearchPreferencesModel();
	    	this.views.loading = new LoadingView();
	    },


	    /**
	     * Search plans by given preferences.
	     */
	    search: function(query, country, from, to, guests) {
	    	if (!this.collections.plans) {
	    		this.collections.plans = new PlanCollection();
	    	}

	    	this.models.preferences.set({
    			query: decodeURIComponent(query),
    			country: country,
    			from: moment(from, 'YYYYMMDD'),
    			to: moment(to, 'YYYYMMDD'),
    			guests: guests,
    			budget: {
    				from: 0,
    				to: 1500
    			}
	    	});

	    	app.layout().setView('.content-view', new SearchView());
	    	app.layout().render();
	    },


	    /**
	     * Query not provided. Anyway search some default
	     * plans. Delegate to search without the query.
	     */
	    searchAll: function(country, from, to, guests) {
	    	this.search('', country, from, to, guests);
	    },


	    /**
	     * Provide index page.
	     */
	    index: function() {
	    	if (!this.collections.eventTimeline) {
	    		this.collections.eventTimeline = new EventTimelineCollection();
	    		this.collections.eventTimeline.fetch();
	    	}
	    	app.layout().setView('.content-view', new IndexView());
	    	app.layout().render();
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
