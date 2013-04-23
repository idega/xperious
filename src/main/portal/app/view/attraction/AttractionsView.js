define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attraction/attractions',
		
		events: {
			'click .attractions-list a' : 'attraction'
		},
	
		attraction: function() {
			app.router.go('attraction', {trigger: true});
			return false;
		}

	});

});