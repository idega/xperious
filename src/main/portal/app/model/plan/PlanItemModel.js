define([
   'app'
], function(app) {

	return Backbone.RelationalModel.extend({
		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.call(this);
			json.on = moment(json.on).format('YYYY-MM-DD');
			return json;
		}
	});

});