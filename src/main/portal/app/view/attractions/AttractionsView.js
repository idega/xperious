define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attractions/attractions',
		
		beforeRender: function() {
			if (!app.attractions.subtype.isNew()) {
				app.trigger('change:title', '{0} - xperious'.format(app.attractions.subtype.get('title').capitalize()));
			}
		}

	});

});