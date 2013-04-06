define([
   'app',
   'model/event/EventCollection',
   'view/index/event/EventPopupView'
],function(
	app,
	EventCollection,
	EventPopupView) {

	return Backbone.View.extend({

		template: 'index/event/slider',
		
		events: {
			'click .event-link' : 'popup'
		},

		initialize: function() {
			_.bindAll(this);

			this.collection = new EventCollection();
			this.collection.on('reset', this.render);
			this.collection.fetch({data: {
				country : app.country()
			}});
		},

		popup: function(e) {
			var model = this.collection.get({id: $(e.currentTarget).data('id')});
			new EventPopupView({model: model}).render();
		},

		serialize: function() {
			return {
				events: _.chain(this.collection.toJSON())
			};
		},
		

		afterRender: function() {
	        $("#events-slider").jcarousel({
	            scroll: 1,
	            wrap: 'circular',
	            itemFallbackDimension: 300
	        });
		}
	});
});