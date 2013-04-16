define([
   'app',
   'view/plan/PlanPopup'
],function(
	app,
	PlanPopup) {


	return Backbone.View.extend({

		template: 'plan/day',


		events: {
			'click a.day-element' : 'popup',
		},

		popup: function(e) {
			var index = $(e.currentTarget).data('index');
			var items = this.plan().itemsByDays().value()[index];
			new PlanPopup({index: index, items: items}).render(); 
		},


		plan: function() {
			return app.search.results.at(app.search.preferences.get('index'));
		},


		serialize: function() {
			// plan will only become available when collection is fetch
			// it is possible that view is being rendered when the plan
			// is not available yet
			if (this.plan()) {
				var days = [];
				this.plan().itemsByDays().each(function(items) {
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
				this.loadImages('.day-element > div:first-child');
			}
		}
	});

});