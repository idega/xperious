define([
   'app',
   'view/index/event/EventPopupView'
],function(
	app,
	EventPopupView) {


	return Backbone.View.extend({

		template: 'index/event/slider',
		
		events: {
			'click .event-link' : 'popup'
		},

		initialize: function() {
			this.collection = app.router.collections.eventTimeline;
			this.collection.on('reset', this.render, this);
		},

		cleanup: function() {
			app.off('change:country', this.refresh, this);
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