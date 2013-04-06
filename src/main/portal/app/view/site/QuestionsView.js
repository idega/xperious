define([
   'app',
   'text!templates/site/questions.html'
],function(
	app,
	html) {

	return Backbone.View.extend({
		template: _.template(html),
	});

});