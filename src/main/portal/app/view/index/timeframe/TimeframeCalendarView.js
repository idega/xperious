define([
	'app'
], function(
	app) {


	var CalendarViewBase =  Backbone.View.extend({
	
		template: 'index/timeframe/calendar',


		initialize: function(options) {
			_.bindAll(this);
			this.model = options.model;
		},


		afterRender: function() {
			this.$el.dialog({
				dialogClass: 'calendar',
				modal: false,
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

			// clicking on anything else except the 
			// dialog itself should close it
			$('html').bind('click', this.empty);
			this.$el.bind('click', function(e) {
				e.stopPropagation();
			});

			// recenter the dialog on window resize
			$(window).resize(this.updatePosition);

			// nip has to follow the field that is being selected
			if (this.property && this.property === 'from') {
				$('.calendar .ui-dialog-content')
					.css('background-position', '115px 0px');

			} else if (this.property && this.property === 'to') {
				$('.calendar .ui-dialog-content')
					.css('background-position', '158px 0px');
			}
		},
	

		open: function() {
			this.$('.datepicker').datepicker({
				dateFormat: 'yy-mm-dd',
				numberOfMonths: 1,
				firstDay: 1,
				modal: false,
				defaultDate: this.model.asString(this.property),
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
		}, 100, false),


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
			$('html').unbind('click', this.empty);
			app.trigger('change:timeframe');
		},
	});

	
	var CalendarViewForToField = CalendarViewBase.extend({
		property: 'to',
		title: 'Deprature Date',
		disable: function(day) {
			return this.model.get('from').isAfter(moment(day));
		}
	});


	var CalendarViewForFromField = CalendarViewBase.extend({
		property: 'from',
		title: 'Arrival Date',
		close: function() {
			this.empty();
			if (!this.model.has('to')) {
				new CalendarViewForToField({
					model: this.model
				}).render();
			}
		}
	});


	var CalendarView = CalendarViewForFromField.extend({
		close: function() {
			this.empty();
			new CalendarViewForToField({
				model: this.model
			}).render();
		}
	});


	return {
		from: CalendarViewForFromField,
		to: CalendarViewForToField,
	};

});