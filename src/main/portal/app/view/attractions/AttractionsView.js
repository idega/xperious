define([
   'app',
   'view/attractions/AttractionsListView'
],function(
	app,
	AttractionsListView) {


	return Backbone.View.extend({

		template: 'attractions/attractions',
		
		initialize: function() {
			app.attractions.subtype.on('change', this.title, this);
		},
		
		cleanup: function() {
			app.attractions.subtype.off('change', this.title, this);
		},
		
		beforeRender: function() {
			this.title();
		},
		
		title: function() {
			if (app.attractions.subtype.has('title')) {
				app.trigger('change:title', '{0} - xperious'.format(app.attractions.subtype.get('title').capitalize()));
			}
		},
		
		afterRender: function() {
			this.findImages('.section').imagesLoaded(_.bind(function() {
				this.setView('.list-view', new AttractionsListView()).render();
			}, this));
		}
	});


});