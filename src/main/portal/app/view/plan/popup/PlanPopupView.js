define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'plan/popup/popup',
		
		initialize: function() {
			app.on('change:day', this.show, this);
		},

		cleanup: function() {
			app.off('change:day', this.show, this);
		},
		
		show: function(day) {
			var plan = app.search.results.at(app.search.pref.get('index'));
			this.items = plan.days()[day];
			this.day = day;
			this.render();
		},

		serialize: function() {
			return {
				day: this.day,
				items: _.map(
					this.items, function(item) { 
						return item.toJSON();
					}
				),
			};
		},
		

		afterRender: function() {
			// become visible only if day has been specified
			if (typeof this.day === 'undefined') return;

			$.fancybox({
				content: this.$el,
				padding: 0,
                hideOnOverlayClick: true,
                enableEscapeButton: true,
                showCloseButton: true,
                overlayColor: '#000',
                overlayOpacity: 0.75,
                autoScale: false,
                autoDimensions: true,
				onStart: function() {
	                $('#fancybox-close').text('Close');
	                $("#fancybox-outer").removeClass().addClass('day-lightbox');
	            }
			});

			require(['google'], _.bind(function(google) {

				var map = new google.maps.Map(
					this.$('.map-holder')[0], {
						zoom: 6,
						center: new google.maps.LatLng(
							64.942160, 
							-18.544922),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false
				});


				/* Ask google to draw day directions on the map */
				var request = {
					origin: undefined,
					destination: undefined,
					waypoints: undefined,
					travelMode: google.maps.TravelMode.DRIVING
				};

				_.each(this.items, _.bind(function(item, index) {
					if (item.get('type') === 'PRODUCT') {
						if (!request.origin) {
							request.origin = new google.maps.LatLng(
								item.get('address').latitude, 
								item.get('address').longitude);

						} else {
							if (request.destination) {
								if (!request.waypoints) {
									request.waypoints = []; 
								}
								request.waypoints.push({
									location: request.destination,
									stopover: true
								});
							}
							request.destination = new google.maps.LatLng(
								item.get('address').latitude, 
								item.get('address').longitude);
						}
					}
				}, this));

				if (request.destination) {
					var service = new google.maps.DirectionsService();
					var display = new google.maps.DirectionsRenderer();
					display.setMap(map);

					service.route(request, _.bind(function(result, status) {
				    	if (status == google.maps.DirectionsStatus.OK) {
				    		display.setDirections(result);
				    		this.appendStats(result);
				    	} else {
				    		this.drawMarkers(map);
				    	}
					}, this));

				} else {
					// only one point is available for the map
					// no point to call directions service
					this.drawMarkers(map);
				}
			}, this));
		},

		appendStats: function(result) {

			var distance = Math.round(_.reduce(
				result.routes[0].legs, 
				function(sum, leg) { 
					return sum + leg.distance.value / 1000; 
				}, 
			0));

    		var duration = moment.duration(_.reduce(
    			result.routes[0].legs, 
    			function(sum, leg) { 
    				return sum + leg.duration.value; 
    			}, 
    			0
	    	), 'seconds').humanize();

    		// display total distance and duration
    		$('<h5>Total distance ' + 
    			distance + 
    			' km, about ' + 
    			duration + 
    			' by car</h5>')
    		.insertAfter('.day-map h4');

		},

		drawMarkers: function(map) {
			_.each(this.items, function(item) {
				if (item.get('type') === 'PRODUCT') {
					new google.maps.Marker({
						 position: new google.maps.LatLng(
							item.get('address').latitude, 
							item.get('address').longitude),
						 title: item.get('title'),
						 map: map
					 });
				}
			});
		}
	});
		

});