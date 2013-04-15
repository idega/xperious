define([
  'backbone.layoutmanager',
  'backbone.relational',
  'backbone.queryparams',
  'backbone.super',
  'moment',
  'jquery.cookie',
  'jquery.fancybox',
  'jquery.hoverIntent',
  'jquery.imagesloaded',
  'jquery.jcarousel',
  'jquery.localScroll',
  'jquery.placeholder',
  'jquery.qtip',
  'jquery.scrollTo',
  'jquery.ui',
  'jquery.ui.selectmenu',
  'jquery.waypoints',
  'jquery.rating',
  'modernizr',
  'common'
], function(LayoutManager) {	


	var JST = window.JST = window.JST || {};


  	LayoutManager.configure({
	  	manage: true,

	  	prefix: "templates/",

	    fetch: function(path) {
	      path = path + ".html";
	      
	      var precompilePath = app.root.substring(1) + path;
	      if (JST[precompilePath]) {
	        return JST[precompilePath];
	      }

	      var done = this.async();
	      $.get(app.root + path, function(contents) {
	        done(_.template(contents));
	      }, "text");
	    }
  	});


  	var app = _.extend({
  		
  		root: '/app/',
  		
	    module: function(additionalProps) {
	      return _.extend({ Views: {} }, additionalProps);
	    },

	    title: function(title) {
	    	document.title = title;
	    },
	    
	    country: function(code) {
	    	if (code) {
	    		$.cookie(
	    			'country', 
	    			code, 
	    			{expires: 14, path: '/'});
	    		app.trigger('change:country');

			} else {
				code = $.cookie('country');
				if (!code) code = 'is';
				return code;
			}
	    },

		layout: function(layout) {
			if (layout) {
				this.layoutCached = layout;
				$('.layout').empty().append(this.layoutCached.el);
				return this.layoutCached;
			} else {
				return this.layoutCached;
			}
		}
	}, Backbone.Events);


  	app.on('change:title', app.title);


  	return app;

});
