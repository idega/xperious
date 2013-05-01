define([
	'app',
	'model/search/SearchTimeframeModel',
	'view/index/timeframe/TimeframeCalendarView',
	'view/index/timeframe/TimeframeTerminalView'
], function(
	app, 
	SearchTimeframeModel,
	TimeframeCalendarView,
	TimeframeTerminalView) {
	

	/* 
	 * Customized calendar views that have chained close() callbacks
	 * to raise terminal view on the end.
	 */
	var CalendarToView = TimeframeCalendarView.to.extend({
		close: function() {
			this.empty();
			new TimeframeTerminalView({model: this.model}).render();
		}
	}); 
	

	var CalendarFromView = TimeframeCalendarView.from.extend({
		close: function() {
			this.empty();
			new CalendarToView({model: this.model}).render();
		}
	});


	return Backbone.View.extend({

		template: 'index/timeframe/timeframe',

		events: {
			'click .ico-calendar .placeholder' : 'init'
		},

		initialize: function() {
			_.bindAll(this);

			this.model = app.search.timeframe;
			app.on('change:timeframe', this.change, this);
		},
		
		cleanup: function() {
			app.off('change:timeframe', this.change, this);
		},
		
		change: function() {
			this.render();
		},

		serialize: function() {
			return {
				from : {
					day: this.model.has('from') 
						? this.model.get('from').format('DD') 
						: undefined,

					month: this.model.has('from') 
						? this.model.get('from').format('MMM') 
						: undefined
				},
				to : {
					day: this.model.has('to') 
						? this.model.get('to').format('DD') 
						: undefined,

					month: this.model.has('to') 
						? this.model.get('to').format('MMM') 
						: undefined 
				}
			};
		},

		afterRender: function() {
			this.$('.day-month.from').click(this.from);
			this.$('.day-month.to').click(this.to);
		},

		init: function(e) {
			// stop event propagation because calendar
			// closes on any click outside the dialog
			e.stopPropagation();
			new CalendarFromView({model: this.model}).render();
		},
		
		to: function(e) {
			// stop event propagation because calendar
			// closes on any click outside the dialog
			e.stopPropagation();
			new TimeframeCalendarView.to({model: this.model}).render();
		},
		
		from: function(e) {
			// stop event propagation because calendar
			// closes on any click outside the dialog
			e.stopPropagation();
			new TimeframeCalendarView.from({model: this.model}).render();
		}
	});

});