define([
	'app'
], function(app) {

	return Backbone.RelationalModel.extend({

		idAttribute: 'id',

		url: function() {
			return '/api/v1/products/subtypes/' + this.get('id');
		}
	});

});