define([
	'app', 
	'model/plan/PlanModel'],
function(
	app, 
	PlanModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/plans/search',

		model: PlanModel,

		initialize: function(models, options) {
			this.query = options.query;
			this.country = options.country;
			this.from = options.from;
			this.to = options.to;
			if (!this.from || !this.to) {
				this.build(this.query);
			}
		},

		fetch: function(options) {
			options = options || {};
			this._super(_.extend(options, 
				{data: {
					query: this.query,
					country: this.country,
					from: this.from,
					to: this.to
				}}
			));
			return this;
		}

	});

});