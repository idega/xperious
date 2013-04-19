define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'search/preferences',

		initialize: function() {
			app.search.pref.on('change', this.render, this);
		},
		
		cleanup: function() {
			app.search.pref.off('change', this.render, this);
		},
		
		serialize: function() {
			return {
				pref: app.search.pref.toJSON()
			};
		}
	});

});