define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'plan/day/product',

		/* Amount to offset the popup top location from the click coordinates */
		offset: 230,


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

			this.$('.product-popup').css('top', this.event.topOffset - $('#fancybox-content').offset().top - this.offset);
			this.$('.product-popup > .nip').css('top', this.offset);
			this.$el.show();
		
		
        	initSlider(
            	'#fancybox-content .popup-gallery-fader .next',
                '#fancybox-content .popup-gallery-fader .prev',
                '#fancybox-content .popup-gallery-fader', 
                1103, 
                false);


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