define([
   'app',
   'model/terminal/TerminalModel'
],function(
	app,
	TerminalModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/terminals/list',

		model: TerminalModel,

		initialize: function() {
			app.on('change:country', this.fetch, this);
		},

		fetched: function() {
			return this.isFetched;
		},

		fetch: function() {
			this._super({data: {
				country: app.country()
			}});
			this.isFetched = true;
		}
	});

});