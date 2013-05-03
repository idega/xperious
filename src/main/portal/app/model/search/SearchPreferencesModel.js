define([
   'app'
],function(
	app) {

	return Backbone.Model.extend({

		initialize: function() {
			app.search.terminals.on('reset', this.onNewTerminals, this);
		},

		onNewTerminals: function() {
			// reset terminal so it does not have the old reference
			if (this.has('arrival')) {
				var arrival = this.get('arrival');
				this.set('arrival', {
					terminal: app.search.terminals.at(0), 
					time: arrival.time
				}, {silent: true});
			}
		},

		toJSON: function() {
			var json = this._super();

			if (this.has('from')) {
				json.from = this.get('from').format('YYYY-MM-DD');
			}

			if (this.has('to')) {
				json.to = this.get('to').format('YYYY-MM-DD');
			}
			
			if (this.has('arrival')) {
				json.arrival = {
					time: moment(this.get('arrival').time).format('HH:mm'),
					terminal: this.get('arrival').terminal
				};
			}

			return json;
		},
		

		diff: function(attr, value) {
			attr = attr.split('.');
			if (this.has(attr[0])) {
				var curr = this.get(attr[0]);
				if (attr.length == 2) {
					curr = curr[attr[1]];
				}
				if (curr) {
					return curr.diff(value) == 0 ? curr : value;
				}
			}
			return value;
		},


		/* Comfort methods to pass optional url parameters to router */		
		budget: function() {
			return (this.has('budget') && this.get('budget').to) 
				? 'budget' 
				: undefined;
		},

		budgetfrom: function() {
			return this.has('budget') 
				? this.get('budget').from 
				: undefined;  
		},
		
		budgetto: function() {
			return this.has('budget') 
				? this.get('budget').to 
				: undefined;  
		},
		
		plan: function() {
			return (this.has('index')) 
				? 'plan'
				: undefined;
		},

		planindex: function() {
			return this.has('index') 
				? this.get('index') + 1 
				: undefined;
		}
	});

});