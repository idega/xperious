define(['app',
	'view/site/LoadingView',
	'view/site/HeaderView',
	'view/site/QuestionsView',
	'view/site/BottomView',
	'view/site/FooterView',
	'view/index/IndexView',
	'view/index/IndexMenuView',
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
	'view/attractions/AttractionsView',
	'view/attractions/AttractionsSubtypeView',
	'view/attractions/AttractionsRegionsView',
	'view/attractions/AttractionsListView',
	'view/attraction/AttractionView',
	'view/attraction/AttractionGalleryView',
], function(app,
	LoadingView,
	HeaderView,
	QuestionsView,
	BottomView,
	FooterView,
	IndexView,
	IndexMenuView,
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
	AttractionsSubtypeView,
	AttractionsRegionsView,
	AttractionsListView,
	AttractionView,
	AttractionGalleryView) {


	return Backbone.Router.extend({

	    routes: {
	    	'search(/:query)/:country/:from/:to/:arrivalterminal/:arrivaltime/:guests(/budget/:budgetfrom/:budgetto)(/plan/:index)' : 'search',
	    	'attractions/:country/:subtype(/:region)(/:product)' : 'attractions',
	    	'events*path' : 'events',
	    	'' : 'index'
	    },


	    initialize: function() {
	    	_.bindAll(this);

	    	// no need to call render() explicitly on this view
	    	// as it listens on special events and blocks ui with
	    	// the modal dialog when required
	    	new LoadingView();

	    	// initialize attractions types and regions in the 
	    	// constructor because they appear in the header and
	    	// are required for almost all pages
	    	app.attractions.subtypes.fetch();
	    },


	    /**
	     * Show a list of attractions or one attraction if selected.
	     */
	    attractions: function(country, subtype, region, product) {
    		app.attractions.country = app.countries.get(country);
    		app.attractions.subtype.set('id', subtype, {silent: true}).fetch();
    		app.attractions.regions.fetch({data: {
				country: country, 
				subtype: subtype
    		}}).done(_.bind(function() {
				if (app.attractions.regions.size()) {

	    			app.attractions.region = (region)
						? app.attractions.regions.get(region) 
						: app.attractions.regions.at(0);
						
					app.attractions.product.clear({silent: true});
					app.attractions.products.reset([], {silent: true});
					
					// this is the soonest we can render the layout
					app.layout((product) 
							? this._layout().attraction() 
							: this._layout().attractions())
						.render();

			    	app.attractions.products.data({
			    		country: country,
			    		subtype: subtype,
			    		region: app.attractions.region.get('id')

			    	}).done(_.bind(function() {
			    		if (product) {
			    			var attributes = app.attractions.products.get(product).attributes;
			    			app.attractions.product = app.attractions.product.set(attributes);
			    		}
			    	}, this));

				} else {
					// no regions where fetched, show empty attractions page
					app.layout(this._layout().attractions()).render();
				}

			}, this));
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
	    		budgetfrom, 
	    		budgetto, 
	    		index) {

    		app.search.terminals.fetch(country);

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

	    		app.layout(this._layout().plan()).render();

	    	} else {
	    		app.search.pref.unset(
	    			'index',
	    			{silent: true});
	    		
	    		app.layout(this._layout().search()).render();
	    	}
	    },

	    
	    /**
	     * Provide index page.
	     */
	    index: function(path) {
	    	app.event.timeline.fetch(app.country());
	    	app.search.terminals.fetch(app.country());
    		app.layout(this._layout().index()).render();	 
	    },
	    

	    /**
	     * Comfort method to navigate more easily.
	     */
	    go: function() {	    	
	    	return this.navigate(
    			this._href(_.initial(arguments)), 
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


	    /**
	     * Build absolute url from given arguments.
	     */
	    href: function() {
	    	return app.root +  this._href(arguments);
	    },
	    
	    _href: function(args) {
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
	    

	    /**
	     * Define layout skeletons for the pages.
	     */
	    _layout: function() {
	    	this.layout = this.layout || {};


	    	return {
	    		index: _.bind(function() {
    		    	var layout = new Backbone.Layout();

    				layout.setView(new IndexView({
    					views: {
    						'.menu-view' : new IndexMenuView(),
    						'.timeframe-view' : new TimeframeView(),
    						'.schedule-view' : new ScheduleView(),
    						'.events-slider .site-block' :  new EventSliderView(),
    						'.footer-view' : new FooterView(),
    						'.bottom-view' : new BottomView({hidden: true})
    					}
    				}));

	    			return layout;
	    		}, this),


	    		search: _.bind(function() {
	    			var layout = new Backbone.Layout();

    		    	layout.setView(new SearchView({
    		    		views: {
    						'.header-view' : new HeaderView(),
    						'.search-preferences-view' : new SearchPreferencesView(),
    	    				'.questions-view' : new QuestionsView(),
    	    				'.footer-view' : new FooterView(),
    	    				'.bottom-view' : new BottomView()
    		    		}
    		    	}));

	    			return layout;
	    		}, this),


	    		plan: _.bind(function() {
    		    	var layout = new Backbone.Layout();

    		    	layout.setView(new PlanView({
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

	    			return layout;
	    		}, this),


	    		events: _.bind(function() {
    		    	var layout = new Backbone.Layout();

    		    	layout.setView(new EventsView({
    		    		views: {
    						'.header-view' : new HeaderView(),
    						'.footer-view' : new FooterView(),
    						'.bottom-view' : new BottomView()
    		    		}
    		    	}));

	    			return layout;
	    		}, this),
	    		

	    		attractions: _.bind(function() {
	    		    	var layout = new Backbone.Layout();

	    		    	layout.setView(new AttractionsView({
	    		    		views: {
	    						'.header-view' : new HeaderView(),
	    						'.subtype-view' : new AttractionsSubtypeView(),
	    						'.regions-view' : new AttractionsRegionsView(),
			    				'.list-view' : new AttractionsListView(),
	    						'.footer-view' : new FooterView(),
	    						'.bottom-view' : new BottomView()
	    		    		}
	    		    	}));

	    			return layout;
	    		}, this),
	    		
	    		
	    		attraction: _.bind(function() {
	    		    	var layout = new Backbone.Layout();

	    		    	layout.setView(new AttractionView({
	    		    		views: {
	    						'.header-view' : new HeaderView(),
	    						'.subtype-view' : new AttractionsSubtypeView(),
	    						'.regions-view' : new AttractionsRegionsView(),
	    						'.gallery-view' : new AttractionGalleryView(),
	    						'.footer-view' : new FooterView(),
	    						'.bottom-view' : new BottomView()
	    		    		}
	    		    	}));

	    			return layout;
	    		}, this),
	    	};
	    }
	    
	});

});
