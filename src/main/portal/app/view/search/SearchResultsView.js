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
			app.router.go(
				'search',
				app.search.preferences.get('query'),
				app.search.preferences.get('country'),
				app.search.preferences.get('from').format('YYYYMMDD'),
				app.search.preferences.get('to').format('YYYYMMDD'),
				app.search.preferences.get('guests'),
				'plan',
				$(event.currentTarget).data('index')
			);
        }
    });


});