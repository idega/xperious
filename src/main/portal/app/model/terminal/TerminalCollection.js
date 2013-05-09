define([
   'app',
   'model/terminal/TerminalModel'
],function(
	app,
	TerminalModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/terminals/list',

		model: TerminalModel,

		fetch: function(country) {
			this.reset([], {silent: true});
			this._super({data: {
				country: (country) ? country : app.country()
			}});
		}
	});

});