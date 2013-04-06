module.exports = function(grunt) {
  grunt.initConfig({

    jst: {
      "dist/debug/templates.js": [
        "app/templates/**/*.html"
      ]
    },

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

    uglify: {
		minify: {
	    	files: {
		    	"dist/release/out.js": ["dist/debug/out.js"]
	    	}
		}
    },
	
	cssmin: {
		"dist/release/out.css": ["dist/debug/out.css"]
	},

    clean: ["dist/"],
  });

  grunt.loadNpmTasks('grunt-contrib');
  
  grunt.registerTask("default", [
      "clean",
      "jst", 
      "requirejs",
      "concat", 
      "uglify",
	  "cssmin"
  ]);

};
