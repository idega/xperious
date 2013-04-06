define([
   'app',
   'text!templates/site/bottom.html'
],function(
	app,
	html) {


	return Backbone.View.extend({
		template: _.template(html),

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