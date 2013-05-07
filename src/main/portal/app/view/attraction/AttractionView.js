define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attraction/attraction',

		
		initialize: function() {
			app.attractions.product.on('change', this.render, this);
		},
		
		cleanup: function() {
			app.attractions.product.off('change', this.render, this);
		},

		serialize: function() {
			return {
				product: app.attractions.product.toJSON() 
			};
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