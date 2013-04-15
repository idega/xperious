define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'search/preferences',

		initialize: function() {
			app.search.preferences.on('change', this.render, this);
		},
		
		cleanup: function() {
			app.search.preferences.off('change', this.render, this);
		},
		
		serialize: function() {
			return {
				pref: app.search.preferences.toJSON()
			};
		}
	});

});