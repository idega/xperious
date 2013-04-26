define([
	'app'
], function(
	app) {


	return Backbone.View.extend({
	
		template: 'index/timeframe/calendar-double',

		
		events: {
			'click .close' : 'next'
		},


		initialize: function(options) {
			_.bindAll(this);
			this.model = options.model;
		},


		afterRender: function() {
			this.$el.dialog({
				dialogClass: 'calendar-double',
				modal: false,
				resizable: false,
				minWidth: 800,
				minHeight: 200,
				open: this.open,
				close: this.empty
			});
			
			// clicking on anything else except the 
			// dialog itself should close it
			$('html').bind('click', this.empty);
			this.$el.bind('click', function(e) {
				e.stopPropagation();
			});

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
				this.onCompletion();
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

		
		onCompletion: function() {
			this.empty();
		},
		
		
		next: function() {
			this.empty();
		},

		
		empty: function() {
			this.$('.datepicker').datepicker('destroy');
			this.$el.dialog('close');
			this.$el.remove();
			$(window).unbind('resize', this.updatePosition);
			$('html').unbind('click', this.empty);
			app.trigger('change:timeframe');
		},
	});

});