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
		
		parse: function(response) {
			// resolve unique plan preview image
			var usedImages = [];
			_.each(response, function(plan) {

				for (var i = 0; i < plan.items.length; i++) {
					if (plan.items[i].type === 'PRODUCT' 
							&& plan.items[i].images 
							&& !_.contains(usedImages, plan.items[i].sourceId)) {
						plan.previewImage = plan.items[i].images[0];
						usedImages.push(plan.items[i].sourceId);
						break;
					}
				}
				
				// no unique image found, use the most relevant then
				if (!plan.previewImage) {
					for (var i = 0; i < plan.items.length; i++) {
						if (plan.items[i].type === 'PRODUCT' && plan.items[i].images) {
							plan.previewImage = plan.items[i].images[0];
							break;
						}
					}
				}

			});
			return response;
		},

		fetch: function(options) {
			options = _.extend(options || {}, {
				data: {
					query: app.search.pref.get('query'),
					country: app.search.pref.get('country'),
					terminal: app.search.pref.get('arrival').terminal,
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