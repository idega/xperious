define([
   'app'
],function(
	app) {

	return Backbone.Model.extend({
		toJSON: function() {
			var json = this._super();
			json.from = this.get('from').format('YYYY-MM-DD');
			json.to = this.get('to').format('YYYY-MM-DD');
			return json;
		}
	});

});