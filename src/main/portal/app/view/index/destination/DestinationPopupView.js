define([
   'app',
   'text!templates/index/destination/popup.html',
],function(
	app,
	html) {


	return Backbone.View.extend({

		template: _.template(html),

		defaultIcon: '/app/images/map-pin.png',

		/**
		 * Supported countries data.
		 */
		markers: _.chain([
	        {
	        	code: 'uk',
	        	title: 'United Kingdom',
	        	icon: '/app/images/map-uk.png',
	        	lat: 51.5171,
	        	lng: -0.1062
	        },
	        {
	        	code: 'is',
	        	title: 'Iceland',
	        	icon: '/app/images/map-is.png',
	        	lat: 64.787583,
	        	lng: -18.413086  
	        }
        ]),


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
                    $("#fancybox-outer").removeClass('event-lightbox');
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