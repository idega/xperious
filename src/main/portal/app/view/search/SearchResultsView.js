define([
   'app',
   'text!templates/search/results.html'
],function(
    app,
    html) {


    return Backbone.View.extend({
        template: _.template(html),

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
        }
    });


});