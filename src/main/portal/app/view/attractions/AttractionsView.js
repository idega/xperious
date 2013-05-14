define([
   'app'
],function(
	app) {


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
		}
	});

});