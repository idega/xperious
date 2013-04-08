define([
   'app',
   'model/event/EventModel'
],function(
	app,
	EventModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/events/timeline',

		model: EventModel,

		initialize: function() {
			app.on('change:country', this.fetch, this);
		},

		fetch: function() {
			this._super({data: {
				country: app.country()
			}});
		}

	});

});