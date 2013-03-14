define([
  // List required dependencies here. Use 'app' everywhere
  // so it will include the required libraries.
  'backbone.layoutmanager',
  'backbone.relational',
  'backbone.queryparams',
  'moment'
], function(LayoutManager) 
{
		
	  // Configure LayoutManager with Backbone Boilerplate defaults.
	  LayoutManager.configure({
	    // Allow LayoutManager to augment Backbone.View.prototype.
	    manage: true
	  });
	
	
	
	  // Provide a global location to place configuration
	  // settings and module creation.
	  var app = {
	    // The root path to run the application.
	    root: '/app/'
	  };
	
	  // Mix Backbone.Events, modules, and layout management into the app object.
	  return _.extend(app, {
	
	    // Create a custom object with a nested Views object.
	    module: function(additionalProps) {
	      return _.extend({ Views: {} }, additionalProps);
	    },
	
	
	    layout: function(template, options) {
	
	    	options = options || {};
	    	options.template = template;
	
	    	if (this.layoutCached && options.template) {
	    		this.layoutCached.template = options.template;
	    	} else {
	    		this.layoutCached = new Backbone.Layout(
					_.extend({ el: "#content"}, options));
	    	}
	
	    	return this.layoutCached;
	    }
	
	  }, Backbone.Events);

});
