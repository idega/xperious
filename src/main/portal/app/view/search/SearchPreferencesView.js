define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'search/preferences',

		initialize: function() {
			app.search.pref.on('change', this.render, this);
			app.search.terminals.on('reset', this.render, this);
		},
		
		cleanup: function() {
			app.search.pref.off('change', this.render, this);
			app.search.terminals.off('reset', this.render, this);
		},
		
		serialize: function() {
			return {
				pref: app.search.pref.toJSON(),
				arrival: {
					time: moment.utc(parseInt(app.search.pref.get('arrival').time)).format('HH:mm'),
					terminal: !_.isEmpty(app.search.terminals) 
						? app.search.terminals.get(app.search.pref.get('arrival').terminal).get('title')
						: undefined
				}
			};
		}
	});

});