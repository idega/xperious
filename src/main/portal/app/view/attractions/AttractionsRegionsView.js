define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'attractions/regions',
		
		events: {
			'click .region-select ul li a' : 'region'
		},

		initialize: function() {
			app.attractions.products.on('change', this.render, this);
		},

		cleanup: function() {
			app.attractions.products.off('change', this.render, this);
		},

		region: function(e) {
			var region = $(e.currentTarget).data('id');
			app.attractions.region = app.attractions.regions.get(region);
			app.attractions.products.data({region: region});
			app.router.go(
				'attractions',
				app.attractions.country.get('code'),
				region,
				app.attractions.subtype.get('id'),
				{trigger: true}
			);
		},

		serialize: function() {
			var selected = app.attractions.region;
			return {
				regions: app.attractions.regions.toJSON(),
				subtype: app.attractions.subtype.toJSON(),
				selected: app.attractions.region.toJSON()
			};
		}
		
	});

});