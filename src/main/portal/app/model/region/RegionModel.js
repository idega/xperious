define([
	'app'
], function(app) {

	return Backbone.RelationalModel.extend({
		idAttribute: 'id'
	});

});