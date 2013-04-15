require([
	"app",
	"router",
	'model/search/SearchPreferencesModel',
	'model/event/EventTimelineCollection',
	'model/plan/PlanCollection'
], function(
	app,
	Router,
	SearchPreferencesModel,
	EventTimelineCollection,
	PlanCollection) {


	app.search = {};
	app.search.preferences = new SearchPreferencesModel();
	app.search.results = new PlanCollection();


	app.event = {};
	app.event.timeline = new EventTimelineCollection();

	
	app.router = new Router();
	Backbone.history.start({
		root: app.root, 
		pushState: true,
		hashChange: false});


});
