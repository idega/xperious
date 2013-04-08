define([
	'app', 
	'model/plan/PlanModel'],
function(
	app, 
	PlanModel) {

	return Backbone.Collection.extend({
		url: '/api/v1/plans/search',

		model: PlanModel,
		
		initialize: function() {
			app.router.preferences.on('change', this.fetch, this);
		},

		fetch: function(options) {
			this._super( 
				{data: {
					query: app.router.preferences.get('query'),
					country: app.router.preferences.get('country'),
					from: app.router.preferences.get('from').format('YYYY-MM-DDT00:00:00'),
					to: app.router.preferences.get('to').format('YYYY-MM-DDT23:59:59'),
					guests: app.router.preferences.get('guests')
				}}
			);
			return this;
		}
	});

});