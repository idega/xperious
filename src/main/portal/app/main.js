require([
	"app",
	"router"
], function(
	app,
	Router) {

  app.router = new Router();

  Backbone.history.start({
	  root: app.root, 
	  pushState: true,
	  hashChange: false});

});
