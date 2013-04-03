define([
   'app',
   'model/event/EventModel'
],function(
	app,
	EventModel) {

	return Backbone.Collection.extend({
		url: '/api/v1/events/timeline',
		model: EventModel
	});

});