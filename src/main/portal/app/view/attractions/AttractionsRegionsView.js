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
			if (!e.metaKey) {
				var region = $(e.currentTarget).data('id');
				app.attractions.region = app.attractions.regions.get(region);
				app.attractions.products.data({region: region});
				app.router.go(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.subtype.get('id'),
					region,
					{trigger: true}
				);
				e.preventDefault();
			}
		},

		serialize: function() {
			return {
				regions: app.attractions.regions.toJSON(),
				subtype: app.attractions.subtype.toJSON(),
				selected: app.attractions.region.toJSON(),
				baseUrl: app.router.href(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.subtype.get('id'))
			};
		}
		
	});

});