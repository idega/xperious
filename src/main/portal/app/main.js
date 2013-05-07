require([
	'app',
	'router',
	'model/country/CountryCollection',
	'model/search/SearchPreferencesModel',
	'model/search/SearchTimeframeModel',
	'model/event/EventTimeline',
	'model/plan/PlanCollection',
	'model/product/ProductSearchResults',
	'model/product/ProductSubtypeCollection',
	'model/product/ProductSubtypeModel',
	'model/product/ProductCollection',
	'model/product/ProductModel',
	'model/terminal/TerminalCollection',
	'model/region/RegionCollection',
	'model/region/RegionModel',
], function(
	app,
	Router,
	CountryCollection,
	SearchPreferencesModel,
	SearchTimeframeModel,
	EventTimeline,
	PlanCollection,
	ProductSearchResults,
	ProductSubtypeCollection,
	ProductSubtypeModel,
	ProductCollection,
	ProductModel,
	TerminalCollection,
	RegionCollection,
	RegionModel) {

	app.countries = new CountryCollection();


	/* Initiate search models and collections. */
	app.search = {};
	app.search.timeframe = new SearchTimeframeModel();
	app.search.terminals = new TerminalCollection();
	app.search.idle = new SearchTimeframeModel();
	app.search.pref = new SearchPreferencesModel();
	app.search.results = new PlanCollection();
	app.search.products = new ProductSearchResults();

	/* Update country terminals when country changes */
	app.on(
		'change:country',
		app.search.terminals.fetch,
		app.search.terminals);

	/* Clean search preferences when new terminals are fetch */
	app.search.terminals.on(
		'reset', 
		app.search.pref.onNewTerminals, 
		app.search.pref);
	
	/* Refresh search results if preferences change */
	app.search.pref.on(
		'change', 
		app.search.results.refetch, 
		app.search.results);
	
	/* Refresh nearby product search when user changes plan day */
	app.on(
		'change:day', 
		app.search.products.fetch, 
		app.search.products);



	/* Initiate attractions models and collections. */
	app.attractions = {};
	app.attractions.country = app.countries.get(app.country());
	app.attractions.subtypes = new ProductSubtypeCollection();
	app.attractions.subtype = new ProductSubtypeModel();
	app.attractions.regions = new RegionCollection();
	app.attractions.region = new RegionModel();
	app.attractions.products = new ProductCollection();
	app.attractions.product = new ProductModel();

	/* Refresh subtypes whenever country is changed */
	app.on(
		'change:country', 
		app.attractions.subtypes.fetch, 
		app.attractions.subtypes);



	/* Initiate event models and collections */	
	app.event = {};
	app.event.timeline = new EventTimeline();

	

	app.router = new Router();
	Backbone.history.start({
		root: app.root, 
		pushState: true,
		hashChange: false});


});
