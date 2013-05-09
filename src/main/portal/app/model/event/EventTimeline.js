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

		fetch: function(country) {
			this._super({data: {
				country: country ? country : app.country()
			}});
		}

	});

});