define([
   'app'
],function(app) {

	return Backbone.Model.extend({

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

});