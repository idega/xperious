define([
	'app', 
	'model/plan/PlanItemModel',
	'model/plan/PlanItemCollection'],
function(
	app, 
	PlanItemModel,
	PlanItemCollection) {


	return Backbone.RelationalModel.extend({

		idAttribute: 'id',

		relations: [{
			type: Backbone.HasMany,
			key: 'items',
			relatedModel: PlanItemModel,
			collectionType: PlanItemCollection,
			includeInJSON: true,
			parse: true
		}],

		
		/* Group plan items by day. This returns days array
		 * that where each element is an array with items for
		 * the day.
		 */
		days: function() {
			if (!this.daysCached) {
				var days = {};
				this.get('items').each(function(item) {
					var on = moment(item.get('on')).format('YYYYMMDD');
					if (!days[on]) {
						days[on] = [];
					}
					days[on].push(item);
				});
				this.daysCached = _.values(days);
			}
			return this.daysCached;
		},


		/* This returns item that should be used for the plan preview.
		 * This is the most relevant, most important item for the plan.
		 */
		preview: function() {
			if (this.get('items').size() > 0) {
				for (var i = 0; i < this.get('items').size(); i++) {
					if (this.get('items').at(i).get('type') === 'PRODUCT') {
						return this.get('items').at(i);
					}
				}
			}
		}
	});

});