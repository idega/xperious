define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'index/event/popup',
		
		serialize: function() {
			return {
				event: this.model.toJSON()
			};
		},
		
		afterRender: function() {
			
			$.fancybox({
				content: this.$el,
                padding: 0,
                modal: false,
                hideOnOverlayClick: true,
                enableEscapeButton: true,
                showCloseButton: true,
                overlayColor: '#000',
                overlayOpacity: 0.75,

                onStart: function() {
                    $("#fancybox-outer").removeClass().addClass('event-lightbox');
                    $('#fancybox-close').text('Close');
                },

                onComplete: function() {
                	initSlider(
                    	'#fancybox-content .popup-gallery-fader .next',
                        '#fancybox-content .popup-gallery-fader .prev',
                        '#fancybox-content .popup-gallery-fader', 
                        1103, 
                        false);

                	var hoverCallback = function() {
                	    var $this = $(this);
                	    $this.toggleClass('hovered', 200, 'swing');
                	};

            	    $('input[type="submit"], a').hoverIntent({
            	        over: hoverCallback,
            	        out: hoverCallback,
            	        interval: 25
            	    });

                    if (window.PIE) {
                        $('.popup-gallery-fader, .event-popup, .event-lightbox, .button-ticket').each(function() {
                            PIE.attach(this);
                        });
                    }
                }
            });

			require(['google'], _.bind(function(google) {
				var map = new google.maps.Map(
					this.$('.map-holder')[0], {
						zoom: 12,
						center: new google.maps.LatLng(
							this.model.get('address').latitude, 
							this.model.get('address').longitude),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						mapTypeControl: false,
						streetViewControl: false,
						zoomControl: false,
						draggable: false,
					    scrollwheel: false,
					    panControl: false
				});
			}, this));
		}
	});
});