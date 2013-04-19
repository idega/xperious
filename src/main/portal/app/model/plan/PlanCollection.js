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
			app.search.pref.on('change', this.refetch, this);
			this.on('request', this.block, this);
			this.on('reset', this.unblock, this);
		},
		
		refetch: function() {
			this.reset([], {silent: true});
			this.fetch();
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
					query: app.search.pref.get('query'),
					country: app.search.pref.get('country'),
					from: app.search.pref.get('from').format('YYYY-MM-DDT00:00:00'),
					to: app.search.pref.get('to').format('YYYY-MM-DDT23:59:59'),
					guests: app.search.pref.get('guests')
				}}
			);
			return this;
		}
	});

});