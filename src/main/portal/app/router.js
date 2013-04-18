define(['app',
	'view/site/LoadingView',
	'view/site/HeaderView',
	'view/site/QuestionsView',
	'view/site/BottomView',
	'view/site/FooterView',
	'view/index/IndexView',
	'view/index/timeframe/TimeframeView',
	'view/index/timeframe/TimeframeGapView',
	'view/index/event/EventSliderView',
	'view/search/SearchView',
	'view/search/SearchPreferencesView',
	'view/plan/PlanView'
], function(app,
	LoadingView,
	HeaderView,
	QuestionsView,
	BottomView,
	FooterView,
	IndexView,	
	TimeframeView,
	TimeframeGapView,
	EventSliderView,
	SearchView,
	SearchPreferencesView,
	PlanView) {

	return Backbone.Router.extend({
		
	    routes: {
	    	'search(/:query)/:country/:from/:to/:guests/:budgetFrom/:budgetTo(/plan/:index)' : 'search',
	    	'*path': 'index'
	    },


	    initialize: function() {
	    	// no need to call render() explicitly on this view
	    	// as it listens on special events and blocks ui with
	    	// the modal dialog when required
	    	new LoadingView();
	    },


	    /**
	     * Search plans by given preferences.
	     */
	    search: function(
	    		query, 
	    		country, 
	    		from, 
	    		to, 
	    		guests,
	    		budgetFrom, 
	    		budgetTo, 
	    		index) {

	    	app.search.preferences.set({
    			query: decodeURIComponent(query || ''),
    			country: country,
    			from: moment(from, 'YYYYMMDD'),
    			to: moment(to, 'YYYYMMDD'),
    			guests: guests,
    			budget: {
    				from: budgetFrom,
    				to: budgetTo
    			}
	    	});


	    	// Set selected plan silently
	    	// because we do not want to
	    	// trigger collection fetch
	    	if (index) {
		    	app.search.preferences.set(
	    			'index', index,
	    			{silent: true});
	    	} else {
	    		app.search.preferences.unset(
	    			'index',  
	    			{silent: true});
	    	}


    		app.layout((index) 
				? this.layout().plan() 
				: this.layout().search())
			.render();
	    },


	    /**
	     * Provide index page.
	     */
	    index: function() {
	    	if (!app.event.timeline.fetched()) {
	    		app.event.timeline.fetch();
	    	}
    		app.layout(this.layout().index()).render();	 
	    },


	    /**
	     * Comfort method to navigate more easily.
	     */
	    go: function() {	    	
	    	return this.navigate(
    			this._url(arguments), 
    			{trigger: true});
	    },
	    
	    
	    /**
	     * Comfort method to update url more easily.
	     */
	    url: function() {
	    	return this.navigate(
	    			this._url(arguments), 
	    			{trigger: false});
	    },


	    _url: function(args) {
	    	return _.map(
    				_.toArray(args), 
    				function(arg) { 
    					return encodeURIComponent(arg); 
    				})
    			.join("/")
    			.replace('//', '/');
	    },

	    layout: function() {
	    	this.layout = this.layout || {};

	    	return {
	    		index: _.bind(function() {
	    			if (!this.layout.index) {
	    		    	this.layout.index = new Backbone.Layout();

	    				this.layout.index.setView(new IndexView({
	    					views: {
	    						'.timeframe-view' : new TimeframeView(),
	    						'.timeframe-gap-view' : new TimeframeGapView(),
	    						'.events-slider .site-block' :  new EventSliderView(),
	    						'.footer-view' : new FooterView(),
	    						'.bottom-view' : new BottomView({hidden: true})
	    					}
	    				}));

	    			}
	    			return this.layout.index;
	    		}, this),
	    		
	    		search: _.bind(function() {
	    			if (!this.layout.search) {
	    		    	this.layout.search = new Backbone.Layout();

	    		    	this.layout.search.setView(new SearchView({
	    		    		views: {
	    						'.header-view' : new HeaderView(),
	    						'.search-preferences-view' : new SearchPreferencesView(),
	    	    				'.questions-view' : new QuestionsView(),
	    	    				'.footer-view' : new FooterView(),
	    	    				'.bottom-view' : new BottomView()
	    		    		}
	    		    	}));

	    			}
	    			return this.layout.search;
	    		}, this),

	    		plan: _.bind(function() {
	    			if (!this.layout.plan) {
	    		    	this.layout.plan = new Backbone.Layout();

	    		    	this.layout.plan.setView(new PlanView({
	    		    		views: {
	    						'.header-view' : new HeaderView(),
	    						'.questions-view' : new QuestionsView(),
	    						'.footer-view' : new FooterView(),
	    						'.bottom-view' : new BottomView()
	    		    		}
	    		    	}));

	    			}
	    			return this.layout.plan;
	    		}, this)
	    	};
	    }
	    
	});

});
