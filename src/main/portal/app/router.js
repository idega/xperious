define(['app',
	'view/site/LoadingView',
	'view/site/HeaderView',
	'view/site/QuestionsView',
	'view/site/BottomView',
	'view/site/FooterView',
	'view/index/IndexView',
	'view/index/timeframe/TimeframeView',
	'view/index/timeframe/TimeframeIdleView',
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
	TimeframeIdleView,
	EventSliderView,
	SearchView,
	SearchPreferencesView,
	PlanView) {


	return Backbone.Router.extend({
		
	    routes: {
	    	'search(/:query)/:country/:from/:to/:guests(/idle/:idlefrom/:idleto)(/budget/:budgetfrom/:budgetto)(/plan/:index)' : 'search',
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
	    		idlefrom,
	    		idleto,
	    		budgetfrom, 
	    		budgetto, 
	    		index) {
	    		    	
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

    			/* Same with idle. Do not set the date
    			 * if they are semantically equal. */ 
    			idle: {
    				from: this._diff(
						app.search.pref.has('idle') 
    						? app.search.pref.get('idle').from 
    						: undefined, 
    					idlefrom 
    						? moment(idlefrom, 'YYYYMMDDHHmm')
    						: undefined),
    				to: this._diff(
						app.search.pref.has('idle') 
    						? app.search.pref.get('idle').to 
    						: undefined, 
    					idleto 
    						? moment(idleto, 'YYYYMMDDHHmm')
    						: undefined)
    			}
	    	});

	    	
	    	// Set selected plan silently
	    	// because we do not want to
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
	    index: function() {
	    	if (!app.event.timeline.fetched()) {
	    		app.event.timeline.fetch();
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
				app.search.pref.get('guests'),
				app.search.pref.idle(),
				app.search.pref.idleto(),
				app.search.pref.idlefrom(),
				app.search.pref.budget(),
				app.search.pref.budgetfrom(),
				app.search.pref.budgetto(),
				app.search.pref.plan(),
				app.search.pref.planindex(),
				options);
	    },


	    _url: function(args) {
	    	return _.map(
	    			_.compact(_.toArray(args)),
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
	    						'.timeframe-idle-view' : new TimeframeIdleView(),
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
