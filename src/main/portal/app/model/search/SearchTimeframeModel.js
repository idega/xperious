define([
	'app'
], function(
	app) {
	

	return Backbone.Model.extend({

		onNewTerminals: function() {
			if (this.has('arrival')) {
				this.unset('arrival');
			}
		},


		/* TODO remove this, this is legacy stuff
		 * to support double calendar
		 */
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

		setDate: function(date, property) {
			this.set(property, moment(date));
			if (property === 'from') {
				// if from is after the to change to make the period valid
				if (this.has('to') && this.get('from').isAfter(this.get('to'))) {
					this.set('to', this.get('from'));
				}
			}
		},

		hasDate: function(date, property) {
			if (!property) { 
				// TODO remove this, this is legacy stuff 
				// to support double calendar
				return this.isFrom(date) || this.isTo(date);
			} else {
				return (property === 'from') 
					? this.isFrom(date) 
					: this.isTo(date);
			}
		},
		
		asString: function(property) {
			if (this.has(property)) {
				return this.get(property).format('YYYY-MM-DD');
			}
		},

		isFrom: function(date) {
			return this.has('from') && 
				moment(this.get('from'))
					.startOf('day')
					.diff(this.toMoment(date)) == 0;
		},

		isTo: function(date) {
			return this.has('to') && 
				moment(this.get('to'))
					.startOf('day')
					.diff(this.toMoment(date)) == 0;
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