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
		},
		
		refetch: function() {
			this.reset([], {silent: true});
			this.fetch();
		},

		fetch: function(options) {
			options = _.extend(options || {}, {
				data: {
					query: app.search.pref.get('query'),
					country: app.search.pref.get('country'),
					terminal: 'keflavik',
					from: app.search.pref.get('from').format('YYYY-MM-DDT00:00:00'),
					to: app.search.pref.get('to').format('YYYY-MM-DDT23:59:59'),
					guests: app.search.pref.get('guests'),
				}
			});
			this._super(options);
			return this;
		}
	});

});