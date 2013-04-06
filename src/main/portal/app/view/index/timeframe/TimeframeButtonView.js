define([
	'app',
	'view/index/timeframe/TimeframeCalendarView'
], function(
	app, 
	TimeframeCalendarView) {
	

	var Timeframe = Backbone.Model.extend({
		addDate: function(date) {
			if (this.isFrom(date)) {
				this.unset('from');
				
			} else  if (this.isTo(date)) {
				this.unset('to');
				
			} else if (!this.has('from')) {
				this.set('from', moment(date));
				
			} else {
				this.set('to', moment(date));
			}
			
			// user has switched the selection
			// invert the period so it is correct
			if (this.get('from') > this.get('to')) {
				var from = this.get('from');
				this.set('from', this.get('to'));
				this.set('to', from);
			}
		},

		hasDate: function(date) {
			return this.isFrom(date) || this.isTo(date);
		},
		
		isFrom: function(date) {
			return this.has('from') && this.get('from').diff(this.toMoment(date)) == 0;
		},

		isTo: function(date) {
			return this.has('to') && this.get('to').diff(this.toMoment(date)) == 0;
		},
		
		toMoment: function(date) {
			if (_.isString(date)) {
				return moment(date, 'YYYY-MM-DD');
			} else {
				return moment(date);
			}
		},
		
		toString: function() {
			return this.has('from') 
				? moment(this.get('from')).format('YYYY-MM-DD')
				: undefined;
		}
	});



	return Backbone.View.extend({

		template: 'index/timeframe/button',

		events: {
			'click .ico-calendar' : 'calendar'
		},

		initialize: function(options) {
			this.model = new Timeframe();
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
			this.insertView(new TimeframeCalendarView({model: this.model})).render();
		}
	});

});