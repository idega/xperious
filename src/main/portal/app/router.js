define([
	'app',
	'modules/plan',
	'modules/search',
	'modules/index',
	'text!templates/app.html'],
function(
	app, 
	Plan,
	Search,
	Index,
	HtmlApp) 
{


	return Backbone.Router.extend({

	    routes: {
	      'search*query': 'search',
	      '*path': 'index'
	    },

	    index: function() {
	    	var layout = app.layout(_.template(''));
	    	layout.insertView(new Index.Views.Model());
	    	layout.render();
	    },
	    
	    search: function(query, param) {
			new Plan.Collection([], {
				query: param['query'],
				country: param['country']
			}).fetch({success: 
				function(collection) {
					alert('Found plans: ' + collection.size());
				}
			});
			this.index();
	    }
	});


});
