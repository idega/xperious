define([
   'app'
],function(
	app) {

	return Backbone.View.extend({

		template: 'site/loading',


		initialize: function() {
			app.on('block', this.render, this);
			app.on('unblock', this.unblock, this);
		},

		cleanup: function() {
			app.off('block', this.render, this);
			app.off('unblock', this.unblock, this);
		},
		
		unblock: function() {
			this.$el.dialog('destroy');
			$(window).off('scroll', this.resize);
		},

		afterRender: function() {		
			this.$el.dialog({
				dialogClass: 'loading',
				closeOnEscape: false,
				resizable: false,
				modal: true,
				height: 300,
				width: 600
			});

			$(window).scroll(this.resize);
		},

		resize: _.debounce(function() {
			$.ui.dialog.overlay.resize();
		}, 100, true)
	});

});