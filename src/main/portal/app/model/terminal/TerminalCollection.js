define([
   'app',
   'model/terminal/TerminalModel'
],function(
	app,
	TerminalModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/terminals/list',

		model: TerminalModel,


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