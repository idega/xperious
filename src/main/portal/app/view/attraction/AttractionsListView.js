define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attraction/list',


		events: {
			'click .attractions-list a' : 'attraction'
		},
	
		initialize: function() {
			app.attractions.products.on('reset', this.render, this);
		},
		
		cleanup: function() {
			app.attractions.products.off('reset', this.render, this);
		},
		
		attraction: function(e) {
			app.router.go(
				'attractions',
				app.attractions.country.get('code'),
				app.attractions.region.get('id'),
				app.attractions.subtype.get('id'),
				$(e.currentTarget).data('id'),
				{trigger: true});
			return false;
		},

		serialize: function() {
			return {
				attractions: app.attractions.products.toJSON()
			};
		},

		afterRender: function() {
        	this.loadImages('.attractions-list .element .img');
		}
	});

});