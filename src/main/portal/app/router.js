define([
	'app',
	'view/index/IndexView'],
function(
	app, 
	IndexView) {

	return Backbone.Router.extend({
	    routes: {
	      '*path': 'index'
	    },

	    index: function() {
	    	var layout = app.layout(_.template(''));
	    	layout.insertView(new IndexView());
	    	layout.render();
	    }

	});
});
