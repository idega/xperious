define([
   'app',
   'model/plan/PlanItemModel'
], function(
	app,
	PlanItemModel) {


	return Backbone.Collection.extend({
		model: PlanItemModel
	});
	
});