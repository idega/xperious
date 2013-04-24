define([
	'app',
	'model/product/ProductModel'],
function(
	app,
	ProductModel) {


	return Backbone.RelationalModel.extend({
		relations: [{
			type: Backbone.HasOne,
			key: 'product',
			relatedModel: ProductModel,
			includeInJSON: true,
			parse: true
		}],
	});


});