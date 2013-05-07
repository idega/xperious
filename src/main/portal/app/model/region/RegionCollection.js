define([
	'app', 
	'model/region/RegionModel'],
function(
	app, 
	RegionModel) {


	return Backbone.Collection.extend({

		url: '/api/v1/regions/list',

		model: RegionModel

	});

});