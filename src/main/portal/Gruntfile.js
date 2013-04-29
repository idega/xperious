module.exports = function(grunt) {
  grunt.initConfig({

	/* Validate javascript files syntax */
	jsvalidate: {
	    files: ['app/**/*.js', 'test/**/*.js', 'lib/**/*.js']
	},
	  
	  
	/* Precompile HTML templates.*/
    jst: {
      "dist/debug/templates.js": [
        "app/templates/**/*.html"
      ]
    },
    
    
    /* Start server for jasmine unit tests */
    connect: {
    	test: {
    		options: {
    			port: 8000,
    			base: '../'
    		}
    	}
    },


    /* Run jasmine unit tests */
    jasmine: {
    	src: ['app/config.js'],
	    options: {
	        specs: 'test/spec/**/*.spec.js',
	        helpers: ['test/helper/responses.helper.js', 'test/lib/sinon/sinon.js'],
	        host: 'http://127.0.0.1:8000/portal',
	        template: require('grunt-template-jasmine-requirejs')
	    }
    },


    /* Use requirejs optimization tool to merge all 
     * javascript files and CSS into one minified 
     * file.
     */
    requirejs: {
    	compile: {
	    	options: {
		    	mainConfigFile: 'app/config.js',
		    	name: 'config',
		    	baseUrl: 'app/',
		    	out: "dist/debug/out.js",
		    	include: ['requireLib'],
		    	paths: {
		    		requireLib: '../lib/require/require',
		    		google: 'empty:'
		    	}
	    	}
    	},
    	css: {
    		options: {
    			cssIn: 'styles/main.css',
    			out: 'dist/debug/out.css',
    			cssPrefix: '/portal/styles/'
    		}
    	}
    },


    /* Join precompiled templates and minified scripts. */
    concat: {
      dist: {
        src: [
          "dist/debug/templates.js",
          "dist/debug/out.js"
        ],
        dest: "dist/debug/out.js",
        separator: ";"
      }
    },

    
    /* Minify joint javascript file. */
    uglify: {
        dist: {
        	options: {
        		report: 'min',
        		// Turn off code optimizations because somehow it removes Backbone parse() method 
        		// and this results in unusable application.
        		compress: {
        			sequences     : false,  // join consecutive statemets with the “comma operator”
        			properties    : false,  // optimize property access: a["foo"] → a.foo
        			dead_code     : false,  // discard unreachable code
        			drop_debugger : false,  // discard “debugger” statements
        			unsafe        : false, // some unsafe optimizations (see below)
        			conditionals  : false,  // optimize if-s and conditional expressions
        			comparisons   : false,  // optimize comparisons
        			evaluate      : false,  // evaluate constant expressions
        			booleans      : false,  // optimize boolean expressions
        			loops         : false,  // optimize loops
        			unused        : false,  // drop unused variables/functions
        			hoist_funs    : false,  // hoist function declarations
        			hoist_vars    : false, // hoist variable declarations
        			if_return     : false,  // optimize if-s followed by return/continue
        			join_vars     : false,  // join var declarations
        			cascade       : false,  // try to cascade `right` into `left` in sequences
        			side_effects  : false,  // drop side-effect-free statements
        			warnings      : true,  // warn about potentially dangerous optimizations/code
        			global_defs   : {}     // global definitions
        		}
        	},
        	files: {
        		'dist/release/out.js' : ['dist/debug/out.js']
        	}
        }
    },

    
    /* Minify joint css file */
	cssmin: {
		"dist/release/out.css": ["dist/debug/out.css"]
	},


	/* Clean dist folder */
    clean: ["dist/"],
  });


  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-jsvalidate');


  grunt.registerTask("default", [
      "clean",
      "jsvalidate",
      "connect",
      "jasmine",
      "jst", 
      "requirejs",
      "concat", 
      "uglify",
	  "cssmin"
  ]);

};
