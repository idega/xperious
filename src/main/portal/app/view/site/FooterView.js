define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'site/footer',

		initialize: function() {
			app.on('change:country', this.render, this);
		},

		cleanup: function() {
			app.off('change:country', this.render, this);
		},

		serialize: function() {
			return {
				country: app.countries.get(app.country()).toJSON()
			};	
		}
	});

});