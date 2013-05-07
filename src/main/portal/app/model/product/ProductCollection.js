define([
	'app', 
	'model/product/ProductModel'],
function(
	app, 
	ProductModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/products/list',

		model: ProductModel,
		
		data: function(data) {
			this.country = data.country ? data.country : this.country;
			this.region = data.region ? data.region : this.region;
			this.subtype = data.subtype ? data.subtype : this.subtype;
			this.trigger('change');
			return this.fetch();
		},

		fetch: function() {
			return this._super({data: {
				country: this.country,
				region: this.region,
				type: 'ATTRACTION',
				subtype: this.subtype
			}});
		}
	});

});