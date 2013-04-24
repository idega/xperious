define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'plan/popup/product',
		
		events: {
			'click .close' : 'hide'
		},
		
		initialize: function() {
			app.on('change:product', this.show, this);
		},

		cleanup: function() {
			app.off('change:product', this.show, this);
		},
		
		show: function(event) {
			this.product = event.product;
			this.offsetTop = event.topOffset;
			this.offsetTopE = event.topOffsetE;
			this.render();
		},
		
		hide: function() {
			this.$el.hide();
			this.product = undefined;
		},

		serialize: function() {
			return {
				product: (this.product) ? this.product.toJSON() : undefined
			};
		},

		afterRender: function() {
			// become visible only if day has been specified
			if (typeof this.product === 'undefined') {
				this.$el.hide();

			} else {
				var top = $('#fancybox-content').offset().top;

				this.$('.product-popup').css(
					'top', 
					(this.offsetTop - top) - 200);

				this.$('.product-popup > .nip').css('top', 
					(this.offsetTopE - top) - 
					(this.offsetTop - top - 200));

				this.$el.show();
			}
			
			
            	initSlider(
                	'#fancybox-content .popup-gallery-fader .next',
                    '#fancybox-content .popup-gallery-fader .prev',
                    '#fancybox-content .popup-gallery-fader', 
                    1103, 
                    false);
//
//            	var hoverCallback = function() {
//            	    var $this = $(this);
//            	    $this.toggleClass('hovered', 200, 'swing');
//            	};
//
//
//        	    $('input[type="submit"], a').hoverIntent({
//        	        over: hoverCallback,
//        	        out: hoverCallback,
//        	        interval: 25
//        	    });
			
			

//			$.fancybox({
//				content: this.$el,
//				padding: 0,
//				modal: false,
//				overlayShow: false,
//                hideOnOverlayClick: false,
//                enableEscapeButton: true,
//                showCloseButton: true,
//                overlayColor: '#000',
//                overlayOpacity: 0.75,
//				onStart: function() {
//	                $('#fancybox-close').text('Close');
//	                $("#fancybox-outer").removeClass().addClass('day-lightbox');
//	            }
//			});
			

			require(['google'], _.bind(function(google) {
				var map = new google.maps.Map(
					this.$('.map-holder')[0], {
						zoom: 10,
						center: new google.maps.LatLng(
							this.product.get('address').latitude, 
							this.product.get('address').longitude),
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