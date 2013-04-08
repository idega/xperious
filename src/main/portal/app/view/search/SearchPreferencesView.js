define([
   'app',
   'text!templates/search/preferences.html'
],function(
	app,
	html) {

	return Backbone.View.extend({

		template: _.template(html),

		initialize: function() {
			app.router.preferences.on('change', this.render, this);
		},
		
		cleanup: function() {
			app.router.preferences.off('change', this.render, this);
		},

		serialize: function() {
			return {
				pref: app.router.preferences.toJSON()
			};
		}
	});

});