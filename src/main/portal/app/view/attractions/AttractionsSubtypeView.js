define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'attractions/subtype',
		
		initialize: function() {
			app.attractions.subtype.on('change', this.render, this);
		},
	
		cleanup: function() {
			app.attractions.subtype.off('change', this.render, this);
		},

		serialize: function() {
			var subtype = app.attractions.subtype;
			return {
				subtype: subtype.isNew() ? undefined : subtype.toJSON() 
			};
		}
		
	});

});