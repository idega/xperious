require([
	"app",
	"router",
	'model/search/SearchPreferencesModel',
	'model/search/SearchTimeframeModel',
	'model/event/EventTimeline',
	'model/plan/PlanCollection',
	'model/product/ProductSearchResults',
	'model/terminal/TerminalCollection'
], function(
	app,
	Router,
	SearchPreferencesModel,
	SearchTimeframeModel,
	EventTimeline,
	PlanCollection,
	ProductSearchResults,
	TerminalCollection) {


	app.search = {};
	app.search.pref = new SearchPreferencesModel();
	app.search.timeframe = new SearchTimeframeModel();
	app.search.idle = new SearchTimeframeModel();
	app.search.results = new PlanCollection();
	app.search.products = new ProductSearchResults();
	app.search.terminals = new TerminalCollection();


	app.event = {};
	app.event.timeline = new EventTimeline();

	
	app.router = new Router();
	Backbone.history.start({
		root: app.root, 
		pushState: true,
		hashChange: false});


});
