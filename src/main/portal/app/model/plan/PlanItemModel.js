define([
   'app'
], function(app) {

	return Backbone.RelationalModel.extend({


		serialize: function() {
			var json = this.toJSON();

			// display only nicely rounded minutes to the user
			// minutes are rounded to 15 minutes intervals
			var minute = moment(json.on).format('m');
			var delta = minute > 0 ? 15 - minute % 15 : 0;
			var rounded = moment(json.on).add(delta, 'minutes');

			json.summary = {};
			json.summary.on = rounded.format('HH:mm');
			json.summary.duration = moment.duration(json.duration).humanize();
			json.summary.summary = this.summary();
			json.summary.image = this.summaryImage();
			
			return json;
		},


		summary: function() {
			if (this.has('shortDescription')) {
				// strip html on shortDescription
				return this.get('shortDescription')
					.replace(/<(?:.|\n)*?>/gm, '');
			}
		},


		summaryImage: function() {
			if (this.has('images')) {
				return this.get('images')[0];

			} else if (this.has('logo')) {
				return this.get('logo');
			}
		}
		

	});

});