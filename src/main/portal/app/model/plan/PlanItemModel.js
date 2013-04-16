define([
   'app'
], function(app) {

	return Backbone.RelationalModel.extend({

		summary: function() {
			if (this.has('shortDescription')) {
				// strip html on shortDescription
				return this.get('shortDescription')
					.replace(/<(?:.|\n)*?>/gm, '');
			}
		},

		summaryImage: function() {
			if (this.has('images')) {
				return this.get('images')[0];

			} else if (this.has('logo')) {
				return this.get('logo');
			}
		}
		

	});

});