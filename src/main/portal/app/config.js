require.config({

	baseUrl: '/portal/app',

	deps: ['main'],

    shim: {

        'underscore': {
            exports: '_'
        },
        
        'jquery': {
            exports: '$'
        },
       
       'backbone': {
           deps: [
               'jquery',
               'underscore'
           ],
           exports: 'Backbone'
       },

       'backbone.relational': {
           deps: [
               'backbone'
           ]
       },
       
       'backbone.queryparams': {
           deps: [
               'backbone'
           ]
       },

       'backbone.layoutmanager': {
           deps: [
                  'backbone'
              ],
              exports: 'Backbone.Layout'
       },
       

       'backbone.super': {
           deps: [
                  'backbone'
              ]
       },
       
       'jquery.fancybox': {
    	   deps: [
    	          'jquery'
    	  ]
       },
       
       'jquery.hoverIntent': {
    	   deps: [
    	          'jquery'
    	  ]
       },
       
       'jquery.imagesloaded': {
    	   deps: [
    	          'jquery'
    	  ]
       },
       
       'jquery.jcarousel': {
    	   deps: [
    	          'jquery'
    	  ]
       },

       'jquery.localScroll': {
    	   deps: [
    	          'jquery'
    	  ]
       },

       'jquery.placeholder': {
    	   deps: [
    	          'jquery'
    	  ]
       },

       'jquery.qtip': {
    	   deps: [
    	          'jquery'
    	  ]
       },
       
       'jquery.scrollTo': {
    	   deps: [
    	          'jquery'
    	  ]
       },
              
       'jquery.ui': {
    	   deps: [
    	          'jquery'
    	  ]
       },
       
       'jquery.ui.selectmenu': {
    	   deps: [
    	          'jquery', 'jquery.ui'
    	  ]
       },

       'jquery.cookie': {
    	   deps: [
    	          'jquery'
    	  ]
       }
       
   },

   paths: {
       'text' : '../lib/require/text',
       'async' : '../lib/require/async',
       'jquery' : '../lib/jquery/jquery',
       'jquery.fancybox' : '../lib/jquery/jquery.fancybox',
       'jquery.hoverIntent' : '../lib/jquery/jquery.hoverIntent',
       'jquery.imagesloaded' : '../lib/jquery/jquery.imagesloaded',
       'jquery.jcarousel' : '../lib/jquery/jquery.jcarousel',
       'jquery.localScroll' : '../lib/jquery/jquery.localScroll',
       'jquery.placeholder' : '../lib/jquery/jquery.placeholder',
       'jquery.qtip' : '../lib/jquery/jquery.qtip',
       'jquery.scrollTo': '../lib/jquery/jquery.scrollTo',
       'jquery.ui' : '../lib/jquery/jquery.ui.custom',
       'jquery.ui.selectmenu' : '../lib/jquery/jquery.ui.selectmenu',
       'jquery.cookie' : '../lib/jquery/jquery.cookie',
       'modernizr' : '../lib/modernizr/modernizr',
       'underscore' : '../lib/underscore/underscore',
       'backbone' : '../lib/backbone/backbone',
       'backbone.relational' : '../lib/backbone/backbone.relational',
       'backbone.layoutmanager' : '../lib/backbone/backbone.layoutmanager',
       'backbone.queryparams' : '../lib/backbone/backbone.queryparams',
       'backbone.super' : '../lib/backbone/backbone.super',
       'moment' : '../lib/moment/moment',
       'google' : '../lib/google/maps'
   }

});