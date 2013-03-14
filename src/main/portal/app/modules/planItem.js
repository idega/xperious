define([
   'app'
], function(app) 
{

	var PlanItem = app.module();

	
	/**
	 * Represents one plan entry. Maps directly on API.
	 */
	PlanItem.Model = Backbone.RelationalModel.extend({
		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.call(this);
			json.on = moment(json.on).format('YYYY-MM-DD');
			return json;
		}
	});



	/**
	 * A list of plan entries, belongs to Plan model.
	 */
	PlanItem.Collection = Backbone.Collection.extend({
		model: PlanItem.Model
	});
	
	
	return PlanItem;
});