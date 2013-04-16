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
  	

  	_.extend(Backbone.View.prototype, {

  		/* Convenient method when you need to get background images on specified selector
  		 * and wait for them to load (usage: this.findImages('.grid').imagesLoaded(...)).
  		 */ 
  		findImages: function(selector) {
  			var images = $();

        	$.each(this.$(selector), function(){
        	    var $el = $(this);

        	    if ($el.css('background-image')) {
        	    	var src = $el
        	    		.css('background-image')
        	    		.replace(/"/g, '')
        	    		.replace(/url\(|\)$/ig, '');

        	    	if (src !== 'none') {
	        	    	images = images
	        	    		.add($('<img>')
	        	    		.attr('src', src));
        	    	}
        	    }
        	});

        	return images;
  		},

  		/* Displays pretty loading indicator when images take long time to load. */
  		loadImages: function(selector) {
        	var images = $();

        	$.each(this.$(selector), function(){
        	    var $el = $(this);

        	    if ($el.css('background-image')) {
        	    	
        	    	var src = $el
        	    		.css('background-image')
        	    		.replace(/"/g, '')
        	    		.replace(/url\(|\)$/ig, '');

        	    	if (src !== 'none') {
	        	    	images = images
	        	    		.add($('<img>')
	        	    		.attr('src', src));
	
	        	    	// embed image using base64 just to be sure
	        	    	// that it is there before any other images
	        	    	$el.append('<div class="loader" data-src="' + src + '"><img src="data:image/gif;base64,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" /></div>');
        	    	}
        	    }
        	});

        	var loaded = images.imagesLoaded();
        	loaded.progress(_.bind(function(isBroken, $images, $proper, $broken) {
        		$proper.each(_.bind(function(index, proper) {
        			this.$(selector + ' .loader[data-src="' + $(proper).attr('src') + '"]')
        			.each(function(index, loader) {
        				$(loader).remove();
        			});
        		}, this));
        	}, this));
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
