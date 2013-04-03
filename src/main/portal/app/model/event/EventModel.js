define([
   'app'
],function(app) {

	return Backbone.Model.extend({
		idAttribute: 'id',

		toJSON: function() {
			var json = this._super();
			json.weekday = moment(json.starting).format('dddd');
			json.day= moment(json.starting).format('DD');
			json.month = moment(json.starting).format('MMM');
			json.year= moment(json.starting).format('YYYY');
			json.starthour = moment(json.starting).format('HH:mm');
			json.endhour = moment(json.ending).format('HH:mm');
			return json;
		}
	});

});