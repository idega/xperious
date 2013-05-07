define([
	'app', 
	'model/product/ProductSearchResultModel'],
function(
	app, 
	ProductSearchResultModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/products/search',

		model: ProductSearchResultModel,

		fetch: function(day) { 
			var plan = app.search.results.at(app.search.pref.get('index'));

			var items = plan.days()[day];
			var lat, lng;
			for (var i = 0; i < items.length; i++) {
				if (items[i].get('type') === 'PRODUCT') {
					lat = items[i].get('address').latitude;
					lng = items[i].get('address').longitude;
					break;
				}
			}

			return this._super({data: {
				lat: lat,
				lng: lng,
				radius: 50
			}});
		}
	});

});