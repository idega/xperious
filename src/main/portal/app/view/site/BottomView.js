define([
   'app'
],function(app) {


	return Backbone.View.extend({

		template: 'site/bottom',

		initialize: function(options) {
			if (options && options.hidden) {
				this.hidden = true;
			}
		},

		afterRender: function() {
			if (!this.hidden) {
				this.$('#bottom').addClass('inner-bottom-section');
			}
		}
	
	});

});