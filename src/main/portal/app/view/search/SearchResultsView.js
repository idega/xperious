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
        		results: this.collection.toJSON(),
        		baseUrl: app.router.href(
					'search',
					app.search.pref.get('query'),
					app.search.pref.get('country'),
					app.search.pref.get('from').format('YYYYMMDD'),
					app.search.pref.get('to').format('YYYYMMDD'),
					app.search.pref.get('arrival').terminal,
					app.search.pref.get('arrival').time,
					app.search.pref.get('guests'),
					app.search.pref.budget(),
					app.search.pref.budgetfrom(),
					app.search.pref.budgetto())
        	};
        },


        result: function(e) {
        	if (!e.metaKey) {
	        	app.search.pref.set(
	        		'index', 
	        		$(e.currentTarget).data('index'),
	        		{silent: true});
	        	app.router.gosearch({trigger: true});
	        	e.preventDefault();
        	}
        },
        

        afterRender: function() {
        	this.loadImages('.element > div:first-child');
        }

    });


});