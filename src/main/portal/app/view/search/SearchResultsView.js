define([
   'app'
],function(
    app) {


    return Backbone.View.extend({

        template: 'search/results',


        events: {
        	'click .element' : 'result'
        },


        initialize: function() {
        	this.collection = app.search.results;
        	this.collection.on('reset', this.render, this);
        },


        cleanup: function() {
        	this.collection.off('reset', this.render, this);
        },


        serialize: function() {
        	return {
        		results: this.collection.toJSON()
        	};
        },


        result: function(event) {
        	app.search.pref.set(
        		'index', 
        		$(event.currentTarget).data('index'),
        		{silent: true});
        	app.router.gosearch({trigger: true});
        },
        

        afterRender: function() {
        	this.loadImages('.element > div:first-child');
        }

    });


});