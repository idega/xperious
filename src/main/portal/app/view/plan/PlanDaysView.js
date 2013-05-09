define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'plan/days',


		events: {
			'click a.day-element' : 'popup',
		},

		popup: function(e) {
			app.trigger('change:day', $(e.currentTarget).data('index')); 
		},


		plan: function() {
			return app.search.results.at(app.search.pref.get('index'));
		},


		serialize: function() {
			// plan will only become available when collection is fetch
			// it is possible that view is being rendered when the plan
			// is not available yet
			if (this.plan()) {
				var days = [];
				_.each(this.plan().days(), function(items) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].get('type') === 'PRODUCT') {
							days.push({
								description: items[i].summary(),
								image: items[i].summaryImage()
							});
							break;
						}
					}
				});

				return {
					days: days
				};
			}
		},


		afterRender: function() {
			if (this.plan()) {
				this.loadImages('.day-element .img > div:first-child');
			}
		}
	});

});