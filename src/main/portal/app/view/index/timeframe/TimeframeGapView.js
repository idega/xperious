define([
	'app',
	'model/search/SearchTimeframeModel',
	'view/index/timeframe/TimeframeCalendarView',
	'view/index/timeframe/TimeframeTimeView'
], function(
	app, 
	SearchTimeframeModel,
	TimeframeCalendarView,
	TimeframeTimeView) {


	return Backbone.View.extend({

		template: 'index/timeframe/gap',

		events: {
			'click .ico-event' : 'popup'
		},
		
		model: new SearchTimeframeModel(),
		
		initialize: function(options) {
			app.on('change:timeframe', this.change, this);
		},

		cleanup: function() {
			app.off('change:timeframe', this.change, this);
		},
		
		change: function() {
			this.render();
		},

		serialize: function() {
			var serialize = {};
			return {
				from : {
					day: this.model.has('from') 
						? this.model.get('from').format('DD') 
						: undefined,

					month: this.model.has('from') 
						? this.model.get('from').format('MMM') 
						: undefined,
						
					hour: this.model.has('from')
						? this.model.get('from').format('HH') 
						: undefined,
						
					minute: this.model.has('from')
						? this.model.get('from').format('mm') 
						: undefined,
				},
				to : {
					day: this.model.has('to') 
						? this.model.get('to').format('DD') 
						: undefined,

					month: this.model.has('to') 
						? this.model.get('to').format('MMM') 
						: undefined,
					
					hour: this.model.has('to')
						? this.model.get('to').format('HH') 
						: undefined,
						
					minute: this.model.has('to')
						? this.model.get('to').format('mm') 
						: undefined
				}
			};
		},

		popup: function() {
			var CalendarView = TimeframeCalendarView.extend({
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

			new CalendarView({model: this.model}).render();
		}
	});

});