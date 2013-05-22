define([
   'app',
   'view/plan/PlanDaysView',
   'view/plan/PlanGalleryView',
   
],function(
	app,
	PlanDaysView,
	PlanGalleryView) {


	return Backbone.View.extend({

		template: 'plan/plan',
		

		initialize: function() {
			app.search.results.on('reset', this.onResults, this);
		},


		onResults: function() {
			// do not render the view simply because the preferences
			// have changed. Render only if index is available which
			// indicates that particular plan was selected.
			if (app.search.pref.has('index')) {
				this.render();
			}
		},

		cleanup: function() {
			app.search.results.off('reset', this.render, this);
		},


		plan: function() {
			return app.search.results.at(app.search.pref.get('index'));
		},


		serialize: function() {
			// plan will only become available when collection is fetch
			// it is possible that view is being rendered when the plan
			// is not available yet
			if (this.plan()) {
				return {
					prefs: app.search.pref.toJSON(),
					plan: this.plan().toJSON(), 
				};
			}
		},


		beforeRender: function() {
			$(window).scrollTop(0);
			app.trigger('change:title', 'Itinerary - xperious');
		},


		afterRender: function() {
			if (this.plan()) {

				// insert views only after the view has been rendered, this helps
				// to avoid ugly page while browser is loading all the images in 
				// random order
				this.findImages('.section').imagesLoaded(_.bind(function() {

					this.setView('.plan-days-view', new PlanDaysView()).render();
					this.setView('.plan-gallery-view', new PlanGalleryView()).render();

					var plan = this.plan();	
					
					require(['google'], _.bind(function(google) {
		
						var map = new google.maps.Map(
							this.$('.map-holder')[0], {
								zoom: app.countries.get(plan.get('country')).get('zoom'),
								center: new google.maps.LatLng(
										app.countries.get(plan.get('country')).get('center').lat,
										app.countries.get(plan.get('country')).get('center').lng),
								mapTypeId: google.maps.MapTypeId.ROADMAP,
								streetViewControl: false
						});
		
						plan.get('items').each(function(item) {
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
					}, this));	
				}, this));

			}
		}
	});

});