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

		spatialCenter: function() {
			if (this.get('items').size() > 0) {
				return {
					lat: this.get('items').at(0).get('latitude'),
					lng: this.get('items').at(0).get('longitude'),
				};
			}
		},

		toJSON: function() {
			var json = this._super();
			json.from = moment(json.from).format('YYYY-MM-DD');
			json.to = moment(json.to).format('YYYY-MM-DD');
			return json;
		}
	});

});