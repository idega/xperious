define([
	'app',
	'model/timeframe/TimeframeModel',
	'view/index/timeframe/TimeframeCalendarView',
	'text!templates/index/timeframe/button.html',
], function(
	app, 
	TimeframeModel,
	TimeframeCalendarView,
	html) {


	return Backbone.View.extend({
		
		template: _.template(html),

		events: {
			'click .ico-calendar' : 'calendar'
		},

		initialize: function() {
			this.model = new TimeframeModel();
			app.on('change:timeframe', this.render, this);
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
			this.insertView(new TimeframeCalendarView({model: this.model})).render();
		}
	});

});