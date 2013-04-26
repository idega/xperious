define([
	'app',
	'view/index/timeframe/TimeframeDoubleCalendarView',
	'view/index/timeframe/TimeframeTimeView'
], function(
	app, 
	TimeframeDoubleCalendarView,
	TimeframeTimeView) {


	return Backbone.View.extend({

		template: 'index/timeframe/idle',

		events: {
			'click .attending-event' : 'popup'
		},
		
		initialize: function() {
			this.model = app.search.idle;
		},

		popup: function(e) {
			var CalendarView = TimeframeDoubleCalendarView.extend({
				
				onCompletion: function() {
					this.empty();
					new TimeframeTimeView({model: this.model}).render();
				},

				next: function() {
					if (this.model.has('from')) {
						this.onCompletion();
					} else {
						this.empty();
					}
				}
			});

			// stop event propagation because calendar
			// closes on any click outside the dialog
			e.stopPropagation();
			new CalendarView({model: this.model}).render();
		}
	});

});