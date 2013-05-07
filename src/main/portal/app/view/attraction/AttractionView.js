define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attraction/attraction',
		
		events: {
			'click .col-2 ul li a' : 'another' 
		},

		
		initialize: function() {
			app.attractions.product.on('change', this.render, this);
		},
		
		cleanup: function() {
			app.attractions.product.off('change', this.render, this);
		},

		serialize: function() {
			return {
				product: app.attractions.product.toJSON(),
				products: app.attractions.products.toJSON(),
				loader: this.loader()
			};
		},

		another: function(e) {
			app.router.go(
				'attractions',
				app.attractions.country.get('code'),
				app.attractions.region.get('id'),
				app.attractions.subtype.get('id'),
				$(e.currentTarget).data('id'),
				{trigger: true}
			);
		},

		beforeRender: function() {
			app.trigger('change:title', 'Attractions - xperious');
			$(window).scrollTop(0);
		},

		afterRender: function() {
			if (!app.attractions.product.isNew()) {
				require(['google'], _.bind(function(google) {
					var map = new google.maps.Map(
						this.$('.map-holder')[0], {
							zoom: 6,
							center: new google.maps.LatLng(
								app.attractions.product.get('address').latitude, 
								app.attractions.product.get('address').longitude),
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							streetViewControl: false
					});
	
					new google.maps.Marker({
						 position: new google.maps.LatLng(
								app.attractions.product.get('address').latitude, 
								app.attractions.product.get('address').longitude),
						 title: 'Arnarstapi',
						 map: map
					 });
				}, this));
			}
		}
	});

});