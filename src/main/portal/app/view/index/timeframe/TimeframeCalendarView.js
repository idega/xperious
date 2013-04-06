define([
	'app'
], function(
	app) {


	return Backbone.View.extend({
	
		template: 'index/timeframe/calendar',

		events: {
			'click .close' : 'empty'
		},

		initialize: function() {
			_.bindAll(this);
		},

		afterRender: function() {

			this.$el.dialog({
				dialogClass: 'calendar',
				modal: true,
				resizable: false,
				minWidth: 800,
				minHeight: 400,
				open: this.open,
				close: this.empty
			});
			
			// a click outside calendar will close the window
			$('.ui-widget-overlay').bind('click', this.empty);

			// recenter the dialog on window resize
			$(window).resize(this.updatePosition);
		},
		
		open: function() {
			this.$('.datepicker').datepicker({
				dateFormat: 'yy-mm-dd',
				numberOfMonths: 2,
				firstDay: 1,
				modal: true,
				defaultDate: this.model.toString(),
				onSelect: this.onDateSelect,
                beforeShowDay: this.beforeShowDay
			});

			this.updateTitlebar();
		},

		onDateSelect: function(dateText) {
			this.model.addDate(dateText); 
			this.updateTitlebar();
			if (this.model.has('from') 
				&& this.model.has('to')) {
				this.empty();
			}			
		},

		beforeShowDay: function(day) {
    		if (moment(day).isBefore(moment(), 'day')) {
    			return [false, ""]; 
    		}
		  	if (this.model.hasDate(day)) {
		  		return [true, "ui-state-highlight"]; 
		  	}
		  	return [true, ""];
		},

		updateTitlebar: function() {
			if (this.model.has('from')) {
				this.$('.from').show();
				this.$('.from strong')
					.text(this.model
						.get('from')
						.format('MMMM D'));
			} else {
				this.$('.from').hide();
			}


			if (this.model.has('to')) {
				this.$('.to').show();
				this.$('.to strong')
					.text(this.model
						.get('to')
						.format('MMMM D'));
			} else {
				this.$('.to').hide();
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