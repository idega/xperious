define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'plan/day/product',

		/* Amount to offset the popup top location from the click coordinates */
		offset: 230,
		
		/* Minimal view height, used to calculate view position in the parent dialog */
		minheight: 700,

		events: {
			'click .close' : 'hide'
		},


		initialize: function() {
			app.on('change:product', this.show, this);
			app.on('change:day', this.hide, this);
		},


		cleanup: function() {
			app.off('change:product', this.show, this);
			app.off('change:day', this.hide, this);
		},


		show: function(event) {
			this.event = event;
			this.render();
		},


		hide: function() {
			this.event = undefined;
			this.render();
		},


		serialize: function() {
			return {
				product: (this.event) 
					? this.event.product.toJSON() 
					: undefined
			};
		},


		afterRender: function() {
			// become visible only after event was fired
			if (typeof this.event === 'undefined') {
				this.$el.hide();
				return;
			}	

			
			var offset = this.offset;
			
			// align popup offset with dialog height so the popup
			// does not get outside the dialog borders
			var y = this.event.topOffset - $('#fancybox-content').offset().top;
			if (y + this.minheight > $('#fancybox-content').height()) {
				offset = y + this.minheight - $('#fancybox-content').height();
			}

			this.$('.product-popup').css('top', y - offset);
			this.$('.product-popup > .nip').css('top', offset);
			this.$el.show();
		
		
        	initSlider(
            	'#fancybox-content .popup-gallery-fader .next',
                '#fancybox-content .popup-gallery-fader .prev',
                '#fancybox-content .popup-gallery-fader', 
                1103, 
                false);


        	this.loadImages('.product-popup .popup-gallery-fader img:first-child');


			require(['google'], _.bind(function(google) {
				var map = new google.maps.Map(
					this.$('.map-holder')[0], {
						zoom: 10,
						center: new google.maps.LatLng(
							this.event.product.get('address').latitude, 
							this.event.product.get('address').longitude),
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