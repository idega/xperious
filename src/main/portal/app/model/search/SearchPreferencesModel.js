define([
   'app'
],function(
	app) {

	return Backbone.Model.extend({

		toJSON: function() {
			var json = this._super();
			json.from = this.get('from').format('YYYY-MM-DD');
			json.to = this.get('to').format('YYYY-MM-DD');
			if (this.has('idle') && this.get('idle').from && this.get('idle').to) {
				json.idle = {
					from: this.get('idle').from.format('YYYY-MM-DD HH:mm'),
					to: this.get('idle').to.format('YYYY-MM-DD HH:mm')
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
			return (this.has('budget') && this.get('budget').from && this.get('budget').to) 
				? 'budget' 
				: undefined;
		},

		budgetfrom: function() {
			return (this.has('budget') && this.get('budget').from) 
				? this.get('budget').from 
				: undefined;  
		},
		
		budgetto: function() {
			return (this.has('budget') && this.get('budget').to) 
				? this.get('budget').to 
				: undefined;  
		},

		idle: function() {
			return (this.has('idle') && this.get('idle').from && this.get('idle').to)
				? 'idle'
				: undefined;
		},

		idlefrom: function() {
			return (this.has('idle') && this.get('idle').from) 
				? this.get('idle').from.format('YYYYMMDDHHmm') 
				: undefined;  
		},
		
		idleto: function() {
			return (this.has('idle') && this.get('idle').to) 
				? this.get('idle').to.format('YYYYMMDDHHmm') 
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