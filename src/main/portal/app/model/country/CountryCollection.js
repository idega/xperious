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
		        	zoom: 6,
		        	pin: {
		        		lat: 51.5171,
		        		lng: -0.1062
		        	},
		        	center: {
		        		lat: 51.5171,
		        		lng: -0.1062
		        	}
				}),

				new CountryModel({
		        	code: 'is',
		        	title: 'Iceland',
		        	icon: '/app/images/map-is.png',
		        	zoom: 6,
		        	pin: {
		        		lat: 64.787583,
		        		lng: -18.413086
		        	},
		        	center: {
		        		lat: 64.787583,
		        		lng: -18.413086
		        	}
				}),

				new CountryModel({
		        	code: 'lt',
		        	title: 'Lithuania',
		        	icon: '/app/images/map-lt.png',
		        	zoom: 7,
		        	pin: {
		        		lat: 54.6833,
		        		lng: 26.2833
		        	},
		        	center: {
		        		lat: 55.2000,
		        		lng: 24.0000
		        	},
				})

			]);
		}

	});

});