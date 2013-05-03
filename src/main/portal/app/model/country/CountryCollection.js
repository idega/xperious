define([
   'app',
   'model/country/CountryModel'
],function(
	app,
	CountryModel) {


	return Backbone.Collection.extend({

		model: CountryModel,

		initialize: function(models, options) {
			this.add([
				new CountryModel({
		        	code: 'uk',
		        	title: 'United Kingdom',
		        	icon: '/app/images/map-uk.png',
		        	lat: 51.5171,
		        	lng: -0.1062
				}),
				new CountryModel({
		        	code: 'is',
		        	title: 'Iceland',
		        	icon: '/app/images/map-is.png',
		        	lat: 64.787583,
		        	lng: -18.413086
				})
			]);
		}

	});

});