define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'search/preferences',

		initialize: function() {
			app.router.models.preferences.on('change', this.render, this);
		},
		
		cleanup: function() {
			app.router.models.preferences.off('change', this.render, this);
		},

		serialize: function() {
			return {
				pref: app.router.models.preferences.toJSON()
			};
		}
	});

});