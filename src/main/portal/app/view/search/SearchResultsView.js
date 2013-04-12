define([
   'app'
],function(
    app) {


    return Backbone.View.extend({

        template: 'search/results',
        
        events: {
        	'click .element' : 'plan'
        },

        initialize: function() {
        	this.collection = app.router.collections.plans;
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

        plan: function(event) {
			app.router.go(
				'search',
				app.router.models.preferences.get('query'),
				app.router.models.preferences.get('country'),
				app.router.models.preferences.get('from').format('YYYYMMDD'),
				app.router.models.preferences.get('to').format('YYYYMMDD'),
				app.router.models.preferences.get('guests'),
				'plan',
				$(event.currentTarget).data('index')
			);
        }
    });


});