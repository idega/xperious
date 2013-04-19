require([
	"app",
	"router",
	'model/search/SearchPreferencesModel',
	'model/search/SearchTimeframeModel',
	'model/event/EventTimelineCollection',
	'model/plan/PlanCollection'
], function(
	app,
	Router,
	SearchPreferencesModel,
	SearchTimeframeModel,
	EventTimelineCollection,
	PlanCollection) {


	app.search = {};
	app.search.pref = new SearchPreferencesModel();
	app.search.timeframe = new SearchTimeframeModel();
	app.search.idle = new SearchTimeframeModel();
	app.search.results = new PlanCollection();


	app.event = {};
	app.event.timeline = new EventTimelineCollection();

	
	app.router = new Router();
	Backbone.history.start({
		root: app.root, 
		pushState: true,
		hashChange: false});


});
