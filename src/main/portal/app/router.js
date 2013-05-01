define(['app',
	'view/site/LoadingView',
	'view/site/HeaderView',
	'view/site/QuestionsView',
	'view/site/BottomView',
	'view/site/FooterView',
	'view/index/IndexView',
	'view/index/timeframe/TimeframeView',
	'view/index/schedule/ScheduleView',
	'view/index/event/EventSliderView',
	'view/search/SearchView',
	'view/search/SearchPreferencesView',
	'view/plan/PlanView',
	'view/plan/day/PlanDayView',
	'view/plan/day/PlanDayProductsView',
	'view/plan/day/PlanDayProductView',
	'view/event/EventsView',
	'view/attraction/AttractionsView',
	'view/attraction/AttractionView',
], function(app,
	LoadingView,
	HeaderView,
	QuestionsView,
	BottomView,
	FooterView,
	IndexView,	
	TimeframeView,
	ScheduleView,
	EventSliderView,
	SearchView,
	SearchPreferencesView,
	PlanView,
	PlanDayView,
	PlanDayProductsView,
	PlanDayProductView,
	EventsView,
	AttractionsView,
	AttractionView) {


	return Backbone.Router.extend({

	    routes: {
	    	'attractions*path' : 'attractions',
	    	'attraction*path' : 'attraction',
	    	'events*path' : 'events',
	    	'search(/:query)/:country/:from/:to/:arrivalterminal/:arrivaltime/:guests(/budget/:budgetfrom/:budgetto)(/plan/:index)' : 'search',
	    	'' : 'index'
	    },


	    initialize: function() {
	    	// no need to call render() explicitly on this view
	    	// as it listens on special events and blocks ui with
	    	// the modal dialog when required
	    	new LoadingView();
	    },


	    /**
	     * Show attraction based on given id.
	     */
	    attraction: function() {
    		app.layout(this._layout().attraction()).render();
	    },
	    

	    /**
	     * Show a list of attractions.
	     */
	    attractions: function() {
    		app.layout(this._layout().attractions()).render();
	    },


	    /**
	     * Show events going on.
	     */
	    events: function() {
    		app.layout(this._layout().events()).render();
	    },
	    

	    /**
	     * Search plans by given preferences.
	     */
	    search: function(
	    		query, 
	    		country, 
	    		from, 
	    		to, 
	    		arrivalterminal,
	    		arrivaltime,
	    		guests,
	    		idlefrom,
	    		idleto,
	    		budgetfrom, 
	    		budgetto, 
	    		index) {
	    	
	    	if (!app.search.terminals.fetched()) {
	    		app.search.terminals.fetch();
	    	}


	    	app.search.pref.set({
	    		query: decodeURIComponent(query || ''),

	    		country: country,

    			guests: guests,

    			budget: {
    				from: budgetfrom,
    				to: budgetto
    			},

    			/* Use smart diff before setting the date.
    			 * We do not want to fire change event 
    			 * without a serious reason. */
    			from: this._diff(
    				app.search.pref.get('from'), 
    				moment(from, 'YYYYMMDD')),
    			to: this._diff(
    				app.search.pref.get('to'), 
    				moment(to, 'YYYYMMDD')),

    			arrival: {
    				time: arrivaltime,
    				terminal: arrivalterminal
    			}
	    	});

	    	
	    	// Set selected plan silently
	    	// because you do not want to
	    	// trigger collection fetch
	    	if (index) {
	    		app.search.pref.set(
		    		'index', 
		    		index - 1, 
		    		{silent: true});
	    	} else {
	    		app.search.pref.unset(
	    			'index',
	    			{silent: true});
	    	}


    		app.layout((index) 
				? this._layout().plan() 
				: this._layout().search())
			.render();
	    },

	    
	    /**
	     * Provide index page.
	     */
	    index: function(path) {
	    	if (!app.event.timeline.fetched()) {
	    		app.event.timeline.fetch();
	    	}
	    	if (!app.search.terminals.fetched()) {
	    		app.search.terminals.fetch();
	    	}
    		app.layout(this._layout().index()).render();	 
	    },
	    

	    /**
	     * Comfort method to navigate more easily.
	     */
	    go: function() {	    	
	    	return this.navigate(
    			this._url(_.initial(arguments)), 
    			_.last(arguments));
	    },


	    /**
	     * Follow search preferences and update url.
	     */
	    gosearch: function(options) {	    	
	    	this.go(
				'search',
				app.search.pref.get('query'),
				app.search.pref.get('country'),
				app.search.pref.get('from').format('YYYYMMDD'),
				app.search.pref.get('to').format('YYYYMMDD'),
				app.search.pref.get('arrival').terminal,
				app.search.pref.get('arrival').time,
				app.search.pref.get('guests'),
				app.search.pref.budget(),
				app.search.pref.budgetfrom(),
				app.search.pref.budgetto(),
				app.search.pref.plan(),
				app.search.pref.planindex(),
				options);
	    },


	    _url: function(args) {
	    	return _.map(
	    			_.without(_.toArray(args), undefined, ''),
    				function(arg) { 
    					return encodeURIComponent(arg);
    				})
    			.join("/")
    			.replace('//', '/');
	    },
	    

	    _diff: function(curr, next) {
	    	return (curr && next && curr.diff(next == 0))
	    		? curr
	    		: next;
	    },
	    

	    _layout: function() {
	    	this.layout = this.layout || {};


	    	return {
	    		index: _.bind(function() {
	    			if (!this.layout.index) {
	    		    	this.layout.index = new Backbone.Layout();

	    				this.layout.index.setView(new IndexView({
	    					views: {
	    						'.timeframe-view' : new TimeframeView(),
	    						'.schedule-view' : new ScheduleView(),
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
	    						'.bottom-view' : new BottomView(),
	    						'.day-view' : new PlanDayView(
    							{
    								views: {
    									'.day-product-view' : new PlanDayProductView(),
    									'.day-products-view' : new PlanDayProductsView()
    								}
    							})
	    		    		}
	    		    	}));

	    			}
	    			return this.layout.plan;
	    		}, this),


	    		events: _.bind(function() {
	    			if (!this.layout.events) {
	    		    	this.layout.events = new Backbone.Layout();

	    		    	this.layout.events.setView(new EventsView({
	    		    		views: {
	    						'.header-view' : new HeaderView(),
	    						'.footer-view' : new FooterView(),
	    						'.bottom-view' : new BottomView()
	    		    		}
	    		    	}));

	    			}
	    			return this.layout.events;
	    		}, this),
	    		

	    		attractions: _.bind(function() {
	    			if (!this.layout.attractions) {
	    		    	this.layout.attractions = new Backbone.Layout();

	    		    	this.layout.attractions.setView(new AttractionsView({
	    		    		views: {
	    						'.header-view' : new HeaderView(),
	    						'.footer-view' : new FooterView(),
	    						'.bottom-view' : new BottomView()
	    		    		}
	    		    	}));

	    			}
	    			return this.layout.attractions;
	    		}, this),
	    		
	    		
	    		attraction: _.bind(function() {
	    			if (!this.layout.attraction) {
	    		    	this.layout.attraction = new Backbone.Layout();

	    		    	this.layout.attraction.setView(new AttractionView({
	    		    		views: {
	    						'.header-view' : new HeaderView(),
	    						'.footer-view' : new FooterView(),
	    						'.bottom-view' : new BottomView()
	    		    		}
	    		    	}));

	    			}
	    			return this.layout.attraction;
	    		}, this),
	    	};
	    }
	    
	});

});
