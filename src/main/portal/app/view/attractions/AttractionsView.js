define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attractions/attractions',
		
		beforeRender: function() {
			app.trigger('change:title', 'Attractions - xperious');
		}

	});

});