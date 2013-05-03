require([
	'app',
	'router',
	'model/country/CountryCollection',
	'model/search/SearchPreferencesModel',
	'model/search/SearchTimeframeModel',
	'model/event/EventTimeline',
	'model/plan/PlanCollection',
	'model/product/ProductSearchResults',
	'model/terminal/TerminalCollection'
], function(
	app,
	Router,
	CountryCollection,
	SearchPreferencesModel,
	SearchTimeframeModel,
	EventTimeline,
	PlanCollection,
	ProductSearchResults,
	TerminalCollection) {

	app.countries = new CountryCollection();

	app.search = {};
	app.search.timeframe = new SearchTimeframeModel();
	app.search.terminals = new TerminalCollection();
	app.search.idle = new SearchTimeframeModel();
	app.search.pref = new SearchPreferencesModel();
	app.search.results = new PlanCollection();
	app.search.products = new ProductSearchResults();


	app.event = {};
	app.event.timeline = new EventTimeline();

	
	app.router = new Router();
	Backbone.history.start({
		root: app.root, 
		pushState: true,
		hashChange: false});


});
