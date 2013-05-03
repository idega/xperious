define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'index/destination/popup',

		defaultIcon: '/app/images/map-pin.png',

		
		initialize: function() {
			this.markers = _.chain(app.countries.toJSON());
		},

		afterRender: function() {
			
            $.fancybox({
				content: this.$el,
                hideOnContentClick: false,
                padding: 0,
                modal: false,
                hideOnOverlayClick: true,
                enableEscapeButton: true,
                showCloseButton: true,
                overlayColor: '#000',
                overlayOpacity: 0.75,
                padding: 0,
                onStart: _.bind(function() {
                    $('#fancybox-close').text('Close');
                    $("#fancybox-outer").removeClass();
                }, this)
            });


			require(['google'], _.bind(function(google) {
				var map = new google.maps.Map(
					this.$('.map-holder')[0], {
						zoom: 3,
						center: new google.maps.LatLng(62.262171, -15.249023),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						mapTypeControl: false,
						streetViewControl: false
				});

				this.markers.each(_.bind(function(descriptor) {
					 var marker = new google.maps.Marker({
						 position: new google.maps.LatLng(descriptor.lat, descriptor.lng),
						 title: descriptor.title,
						 icon: this.defaultIcon,
						 map: map
					 });
					 descriptor.marker = marker;
					 
					 if (descriptor.code === app.country()) {
						descriptor.marker.setIcon(descriptor.icon);
					 }
				}, this));

				this.markers.each(_.bind(function(descriptor) {
					 google.maps.event.addListener(
						 descriptor.marker, 
						 'click', 
						 _.bind(function() {
							 this.resetMarkers();
							 descriptor.marker.setIcon(descriptor.icon);
							 app.country(descriptor.code);
						 }, this));
				 }, this));

			}, this));
		},

		resetMarkers: function() {
			this.markers.each(_.bind(function(descriptor) { 
				 descriptor.marker.setIcon(this.defaultIcon);
			}, this));
		}
	});
});