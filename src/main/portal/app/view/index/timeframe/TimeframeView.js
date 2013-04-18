define([
	'app',
	'model/search/SearchTimeframeModel',
	'view/index/timeframe/TimeframeCalendarView'
], function(
	app, 
	SearchTimeframeModel,
	TimeframeCalendarView) {

	return Backbone.View.extend({

		template: 'index/timeframe/timeframe',

		events: {
			'click .ico-calendar' : 'calendar'
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

		calendar: function() {
			new TimeframeCalendarView({model: this.model}).render();
		}
	});

});