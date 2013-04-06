define([
   'app',
   'text!templates/site/footer.html'
],function(
	app,
	html) {

	return Backbone.View.extend({
		template: _.template(html),
	});

});