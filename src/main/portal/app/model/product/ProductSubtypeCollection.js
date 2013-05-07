define([
	'app', 
	'model/product/ProductSubtypeModel'],
function(
	app, 
	ProductSubtypeModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/products/subtypes/list',

		model: ProductSubtypeModel,

		fetch: function() {
			return this._super({data: {
				country: app.country(),
				type: 'ATTRACTION'
			}});
		}
	});

});