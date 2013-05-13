define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attractions/list',


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
			if (!e.metaKey) {
				app.router.go(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.subtype.get('id'),
					app.attractions.region.get('id'),
					$(e.currentTarget).data('id'),
					{trigger: true});
				e.preventDefault();
			}
		},

		serialize: function() {
			return {
				attractions: app.attractions.products.toJSON(),
				loader: this.loader(),
				baseUrl: app.router.href(
					'attractions',
					app.attractions.country.get('code'),
					app.attractions.subtype.get('id'),
					app.attractions.region.get('id'))
			};
		},

		afterRender: function() {
        	this.loadImages('.attractions-list .element .img');
		}
	});

});