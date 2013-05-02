define([
	'app'
], function(
	app) {


	return Backbone.View.extend({

		template: 'index/timeframe/terminal',

		
		events: {
			'change .time .picker' : 'change',
			'change .location .picker' : 'change',
			'click .buttons .idontknow' : 'idontknow',
			'click .buttons .button' : 'empty'
		},


		change: function() {
			var time = this.$('.time .picker').val().split(':');
			this.model.set('arrival', {
				time: moment.duration({
						hours: time[0], 
						minutes: time[1]
					}).asMilliseconds(),
				terminal: this.$('.location .picker').val()
			});
		},
		

		idontknow: function() {
			this.model.set('arrival', {
				time: moment.duration({
						hours: 10, 
						minutes: 0
					}).asMilliseconds(),
				terminal: app.search.terminals.at(0).get('code')
			});
			this.empty();
		},


		initialize: function(options) {
			_.bindAll(this);
			this.model = options.model;
		},


		serialize: function() {
			return {
				'terminals' : app.search.terminals.toJSON(),
			};
		},


		afterRender: function() {
			this.$el.dialog({
				dialogClass: 'calendar terminal',
				modal: false,
				resizable: false,
				width: 270,
				minHeight: 200,
				close: this.empty,
				position: {
					my: 'top',
					at: 'bottom',
					of: $('.ico-calendar')
				}
			});

			var $location = this.$('.location .picker');
			$location.val(this.model.get('terminal'));
			$location.selectmenu({ maxHeight: 150 });
			$location.selectmenu('widget').addClass('picker');

			var $time = this.$('.time .picker');
			$time.val(this.model.get('from').format('HH:mm'));
			$time.selectmenu({ maxHeight: 120 });
			$time.selectmenu('widget').addClass('picker');

			// clicking on anything else except the 
			// dialog itself should close it
			$('html').bind('click', this.empty);
			this.$el.bind('click', function(e) {
				e.stopPropagation();
			});
			
			// recenter the dialog on window resize
			$(window).resize(this.updatePosition);
		},

		
		updatePosition: _.debounce(function() {
			this.$el.dialog(
				"option", 
				"position", {
					my: 'top',
					at: 'bottom',
					of: $('.ico-calendar')
			});
		}, 100, false),


		empty: function() {
			this.$el.dialog('close');
			this.$el.remove();
			$(window).unbind('resize', this.updatePosition);
			$('html').unbind('click', this.empty);
		}
	});


});