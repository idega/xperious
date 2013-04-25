define([
	'app'
], function(
	app) {


	var CalendarView =  Backbone.View.extend({
	
		template: 'index/timeframe/calendar',


		initialize: function(options) {
			_.bindAll(this);
			this.model = options.model;
		},


		afterRender: function() {
			this.$el.dialog({
				dialogClass: 'calendar',
				modal: true,
				resizable: false,
				width: 270,
				minHeight: 200,
				open: this.open,
				close: this.empty,
				position: {
					my: 'top',
					at: 'bottom',
					of: $('.ico-calendar')
				}
			});
			
			// a click outside calendar will close the window
			$('.ui-widget-overlay').bind('click', this.empty);

			// recenter the dialog on window resize
			$(window).resize(this.updatePosition);
		},
		
		
		open: function() {
			this.$('.datepicker').datepicker({
				dateFormat: 'yy-mm-dd',
				numberOfMonths: 1,
				firstDay: 1,
				modal: false,
				defaultDate: this.model.toString(),
				onSelect: this.onDateSelect,
                beforeShowDay: this.beforeShowDay
			});

			this.updateTitlebar();
		},

		
		onDateSelect: function(day) {
			this.model.setDate(day, this.property);
			this.updateTitlebar();
			if (this.model.has(this.property)) {
				this.close();
			}
		},


		beforeShowDay: function(day) {
    		if (this.disable(day)) {
    			return [false, ""]; 
    		}
		  	if (this.model.hasDate(day, this.property)) {
		  		return [true, "ui-state-highlight"]; 
		  	}
		  	return [true, ""];
		},
		

		updateTitlebar: function() {
			this.$('.arrival-departure').text(this.title);
			if (this.model.has(this.property)) {
				this.$('.titlebar .selection').show();
				this.$('.titlebar .selection strong').text(
					this.model
						.get(this.property)
						.format('MMMM D'));	
			} else {
				this.$('.titlebar .selection').hide();
			}

		},


		updatePosition: _.debounce(function() {
			this.$el.dialog(
				"option", 
				"position", {
					my: 'top',
					at: 'bottom',
					of: $('.ico-calendar')
			});
		}, this),


		disable: function(day) {
			return moment(day).isBefore(moment(), 'day');
		},
		

		close: function() {
			this.empty();
		},

		
		empty: function() {
			this.$('.datepicker').datepicker('destroy');
			this.$el.dialog('close');
			this.$el.remove();
			$(window).unbind('resize', this.updatePosition);
			app.trigger('change:timeframe');
		},
	});


	var CalendarViewForToField = CalendarView.extend({
		property: 'to',
		title: 'Deprature Date',
		disable: function(day) {
			return this.model.get('from').isAfter(moment(day));
		}
	});

	
	var CalendarViewForFromField = CalendarView.extend({
		property: 'from',
		title: 'Arrival Date',
		close: function() {
			this.empty();
			new CalendarViewForToField({
				model: this.model		
			}).render();
		}

	});


	return CalendarViewForFromField;
});