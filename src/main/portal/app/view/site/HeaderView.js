define([
   'app'
],function(app) {


	return Backbone.View.extend({

		template: 'site/header',
		
		events: {
			'click #logo' : 'logo'
		},
		
		logo: function() {
			app.router.go('', {trigger: true});
		}
	});

});