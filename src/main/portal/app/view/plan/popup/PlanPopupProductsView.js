define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'plan/popup/products',
		

		events: {
			'click .activities-block .menu li a' : 'product'
		},


		initialize: function() {
			app.search.products.on('reset', this.render, this);
		},


		cleanup: function() {
			app.search.products.off('reset', this.render, this);
		},

		
		product: function(e) {
			var id = $(e.currentTarget).data('id');
			for (var i = 0; i < app.search.products.size(); i++) {
				if (app.search.products.at(i).get('product').get('id') === id) {
					// product found, trigger change product event
					app.trigger('change:product', {
						product: app.search.products.at(i).get('product'),
//						topOffset: e.pageY,
						topOffset: $(e.currentTarget).offset().top
					});  
					break;
				}
			}
			
			return false;
		},


		serialize: function() {
			var activities = [], attractions = [], restaurants = [];

			if (app.search.products.size() > 0) {
				var plan = app.search.results.at(app.search.pref.get('index'));

				var existing = _.map(
					plan.get('items').toArray(), 
					function(item) { 
						return item.get('type') === 'PRODUCT' 
							? item.get('sourceId') 
							: undefined;
					}
				);
	
				app.search.products.each(_.bind(function(product) {
					if (!_.contains(existing, product.get('product').get('id'))) {
						if (product.get('product').get('type') === 'ACTIVITY') {
							activities.push(product.toJSON());
							
						}  else if (product.get('product').get('type') === 'ATTRACTION') {
							attractions.push(product.toJSON());
							
						} else if (product.get('product').get('type') === 'RESTAURANT') {
							restaurants.push(product.toJSON());							
						}

					}
				}, this));
			}

			return {activities: activities, attractions: attractions, restaurants: restaurants};
		}
	});


});