define([
  // List required dependencies here. Use 'app' everywhere
  // so it will include the required libraries.
  'backbone.layoutmanager',
  'backbone.relational',
  'backbone.queryparams',
  'backbone.super',
  'moment',
  'jquery.cookie'
], function(LayoutManager) 
{

	  LayoutManager.configure({
	    // allow LayoutManager to augment Backbone.View.prototype.
	    manage: true
	  });
	
	
	  var app = {
	    root: '/app/'
	  };
	
	  // mix Backbone.Events, modules, and layout management into the app object
	  return _.extend(app, {


	    module: function(additionalProps) {
	      return _.extend({ Views: {} }, additionalProps);
	    },

	    
	    country: function(code) {
	    	if (code) {
	    		$.cookie('country', code, {expires: 14, path: '/'});
	    	} else {
	    		code = $.cookie('country');
	    		if (!code) code = 'is';
	    		return code;
	    	}
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
