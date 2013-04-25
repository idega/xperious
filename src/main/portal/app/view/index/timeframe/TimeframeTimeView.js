define([
	'app'
], function(
	app) {


	return Backbone.View.extend({
	
		template: 'index/timeframe/time',


		events: {
			'click .close' : 'empty',
			'change .timepicker-from' : 'change',
			'change .timepicker-to' : 'change'
		},


		initialize: function(options) {
			_.bindAll(this);

			if (this.model.has('from') && this.model.get('from').hours() == 0) {
				this.model.set('from', this.model.get('from').hours(8));
			}

			if (this.model.has('to') && this.model.get('to').hours() == 0) {
				this.model.set('to', this.model.get('to').hours(17));
			}
		},


		serialize: function() {
			return {
				date: {
					from: this.model.get('from').format('MMMM D'),
					to: this.model.has('to') 
						? this.model.get('to').format('MMMM D')
						: this.model.get('from').format('MMMM D')
				}
			};
		},


		change: function() {
			var value1 = this.$('select.timepicker-from').val().split(':');
			var from = this.model
				.get('from')
				.hours(value1[0])
				.minutes(value1[1]);
			this.model.set('from', from);

			var value2 = this.$('select.timepicker-to').val().split(':');
			var to = this.model
				.get('to')
				.hours(value2[0])
				.minutes(value2[1]);
			this.model.set('to', to);

			this.balance();
		},


		afterRender: function() {

			this.$el.dialog({
				dialogClass: 'calendar-double',
				modal: true,
				resizable: false,
				minWidth: 580
			});			


			var $from = this.$('.timepicker-from');
			$from.val(this.model.get('from').format('HH:mm'));
			$from.selectmenu();
			$from.selectmenu('widget').addClass('timepicker timepicker-from');

			var $to = this.$('.timepicker-to');
			$to.val(this.model.get('to').format('HH:mm'));
			$to.selectmenu();
			$to.selectmenu('widget').addClass('timepicker timepicker-to');


			// make sure that only correct time intervals can be selected
			// disable some options if they would result in invalid selection
			this.balance();

			// a click outside calendar will close the window
			$('.ui-widget-overlay').bind('click', this.empty);

			// recenter the dialog on window resize
			$(window).resize(this.updatePosition);
		},

	
		balance: function() {
			var total = this.$('select.timepicker-from option').size();
			var from = this.$('select.timepicker-from')[0].selectedIndex;
			var to = this.$('select.timepicker-to')[0].selectedIndex;

			var select = this.$('select.timepicker-to');
			for (var i = 0; i < total; i++) {
				if (i < from) {
					select.selectmenu('disable', i);
				} else {
					select.selectmenu('enable', i);
				}
			}

			if (to < from) {
				select.selectmenu('index', from);
			}
		},


		updatePosition: _.debounce(function() {
			this.$el.dialog("option", "position", "center");
		}, this),		
	

		empty: function() {
			this.$('.datepicker').datepicker('destroy');
			this.$el.dialog('close');
			this.$el.remove();
			$(window).unbind('resize', this.updatePosition);
			app.trigger('change:timeframe');
		},
	});

});