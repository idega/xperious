define([
   'app'
],function(app) {


	return Backbone.View.extend({

		template: 'site/bottom',

		initialize: function(options) {
			app.on('change:country', this.render, this);
			if (options && options.hidden) {
				this.hidden = true;
			}
		},

		cleanup: function() {
			app.off('change:country', this.render, this);
		},

		afterRender: function() {
			if (!this.hidden) {
				this.$('#bottom').addClass('inner-bottom-section');
			}
		},
		
		serialize: function() {
			return {
				country: app.countries.get(app.country()).toJSON() 
			};
		}
	});

});