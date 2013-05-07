define([
	'app'],
function(
	app) {

	return Backbone.RelationalModel.extend({

		idAttribute: 'id',

		url: function() {
			return '/api/v1/products/' + this.get('id');
		},

		toJSON: function() {
			var json = this._super();
			if (json.shortDescription) {
				// strip html on shortDescription
				json.summary = this
					.get('shortDescription')
					.replace(/<(?:.|\n)*?>/gm, '');
			}
			return json;
		}

	});

});