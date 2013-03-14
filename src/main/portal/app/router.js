define([
	'app',
	'moment',
	'modules/plan',
	'modules/search',
	'modules/index',
	'text!templates/app.html'],
function(
	app, 
	moment,
	Plan,
	Search,
	Index,
	HtmlApp) 
{


	return Backbone.Router.extend({

	    routes: {
	      'search*query': 'searchAction',
	      'index': 'indexAction',
	      '*path': 'defaultAction'
	    },


	    indexAction: function() {
	    	var layout = app.layout(_.template(''));
	    	layout.insertView(new Index.Views.Model());
	    	layout.render();
	    },


	    searchAction: function(query, param) {
	    	var model = new Search.Model({}, {query: param['q']});
			
			model.save([], {success: function(model, response, options) {
				var layout = app.layout(_.template(HtmlApp));

				var collection = new Plan.Collection(response);
		    	layout.setView(
	    			'#SearchView', new Search.Views.Model(
	    			{query: decodeURIComponent(param['q'])}));
		    	layout.setView(
	    			'#PlanListView', new Plan.Views.Collection(
	    			{model: collection}));		

		    	// found anything?
		    	if (collection.selected()) {
		    		layout.setView(
		    			'#PlanView', new Plan.Views.Model(
		    			{model: collection}));
		    	} else {
		    		var planView = layout.getView('#PlanView');
		    		if (planView) planView.remove();
		    	}

		    	layout.render();
			}});	    	
	    },


	    defaultAction: function(path) {
	    	app.layout(_.template(HtmlApp))
	    		.setViews({'#SearchView': new Search.Views.Model()})
	    		.render();
	    }		
	});


});
