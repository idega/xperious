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
				loader: this.loader(),
				baseUrl: app.router.href(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.subtype.get('id'),
					app.attractions.region.get('id'))
			};
		},

		another: function(e) {
			if (!e.metaKey) {
				app.router.go(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.subtype.get('id'),
					app.attractions.region.get('id'),
					$(e.currentTarget).data('id'),
					{trigger: true}
				);
				e.preventDefault();
			}
		},

		beforeRender: function() {
			$(window).scrollTop(0);
			if (!app.attractions.product.isNew()) {
				app.trigger('change:title', '{0} - xperious'.format(app.attractions.product.get('title')));
			}
		},

		afterRender: function() {
			if (!app.attractions.product.isNew()) {
				require(['google'], _.bind(function(google) {
					var map = new google.maps.Map(
						this.$('.map-holder')[0], {
							zoom: 9,
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
						 title: app.attractions.product.get('title'),
						 map: map
					 });
				}, this));
			}
		}
	});

});