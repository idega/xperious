define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'plan/day/day',
		

		events: {
			'click .content h4 span' : 'clickShowProduct',
			'click .more-info' : 'clickMoreInfo'
		},


		initialize: function() {
			app.on('change:day', this.show, this);
		},


		cleanup: function() {
			app.off('change:day', this.show, this);
		},


		show: function(day) {
			this.plan = app.search.results.at(app.search.pref.get('index'));
			this.items = this.plan.days()[day];
			this.day = day;
			this.render();
		},


		hide: function() {
			this.day = undefined;
		},


		serialize: function() {
			return {
				day: this.day,
				duration: _.reduce(
						this.items, function(sum, item) {
							return (item.get('type') !== 'LODGING') 
								? sum + item.get('duration') 
								: sum;
					}, 0), 
				items: _.map(
					this.items, function(item) { 
						return item.serialize();
					}
				)
			};
		},


		clickShowProduct: function(e) {
			e.stopPropagation();
			app.trigger('change:product', {
				product: this.items[$(e.currentTarget).data('index')],
				topOffset: this.$(e.currentTarget).offset().top,
				nip: 'top'
			});
		},
		
		
		clickMoreInfo: function(e) {
			e.stopPropagation();
			var title = this.$(e.currentTarget).closest('.wrapper').find('.wrapper-title');
			app.trigger('change:product', {
				product: this.items[title.data('index')],
				topOffset: title.offset().top,
				nip: 'top'
			});
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
	            },
	            onClosed: this.hide
			});

			require(['google'], _.bind(function(google) {

				var map = new google.maps.Map(
					this.$('.map-holder')[0], {
						zoom: app.countries.get(this.plan.get('country')).get('zoom'),
						center: new google.maps.LatLng(
								app.countries.get(this.plan.get('country')).get('center').lat,
								app.countries.get(this.plan.get('country')).get('center').lng),
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
				    		this.appendDistance(result);
				    	}
			    		this.drawMarkers(map);
					}, this));

				} else {
					// only one point is available for the map
					// no point to call directions service
					this.drawMarkers(map);
				}
			}, this));
		},


		appendDistance: function(result) {
			var distance = Math.round(_.reduce(
				result.routes[0].legs, 
				function(sum, leg) { 
					return sum + leg.distance.value / 1000; 
				}, 
			0));

			this.$('.total-distance').text('Total distance: ' + distance + 'km');

			//    		var duration = moment.duration(_.reduce(
			//    			result.routes[0].legs, 
			//    			function(sum, leg) { 
			//    				return sum + leg.duration.value; 
			//    			}, 
			//    			0
			//	    	), 'seconds').humanize();
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