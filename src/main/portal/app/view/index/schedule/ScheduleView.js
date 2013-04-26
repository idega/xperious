define([
	'app',
	'view/index/schedule/ScheduleCalendarView',
	'view/index/schedule/ScheduleTimeView'
], function(
	app, 
	ScheduleCalendarView,
	ScheduleTimeView) {


	return Backbone.View.extend({

		template: 'index/schedule/schedule',

		events: {
			'click .attending-event' : 'popup'
		},
		
		initialize: function() {
			this.model = app.search.idle;
		},

		popup: function(e) {
			var CalendarView = ScheduleCalendarView.extend({
				
				onCompletion: function() {
					this.empty();
					new ScheduleTimeView({model: this.model}).render();
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