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
			app.router.models.preferences.on('change', this.fetch, this);
			this.on('request', this.block, this);
			this.on('reset', this.unblock, this);
		},
		
		block: function() {
			app.trigger('block');
		},
		
		unblock: function() {
			app.trigger('unblock');
		},

		fetch: function(options) {
			this._super( 
				{data: {
					query: app.router.models.preferences.get('query'),
					country: app.router.models.preferences.get('country'),
					from: app.router.models.preferences.get('from').format('YYYY-MM-DDT00:00:00'),
					to: app.router.models.preferences.get('to').format('YYYY-MM-DDT23:59:59'),
					guests: app.router.models.preferences.get('guests')
				}}
			);
			return this;
		}
	});

});