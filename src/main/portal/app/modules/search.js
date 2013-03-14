define([
   'app',
   'text!templates/search/model.html'],
function(
	app, 
	HtmlModel) 
{

	var Search = app.module();


	/**
	 * Search query model. Use save to submit search
	 * because API expects to be queried by POST.
	 */
	Search.Model = Backbone.Model.extend({

		url: '/api/v1/search',

		defaults: function() {
			return {
				country: 'IS'
			};
		},

		initialize: function(attrs, options) {
			this.build(options.query);
		},

		build: function(query) {

			var numberRegexp = new RegExp('[1-9]+(?= *(month|week|day))', 'gi');
			var periodRegexp = new RegExp('(months|weeks|days|month|week|day)', 'gi');

			var number = query.match(numberRegexp);
			var period = query.match(periodRegexp);

			if (number || period) {
				if (!number) number = [1]; // number not given, guess it is 1

				var from = moment()
					.startOf('day')
					.add('days', 1);

				var to = moment()
					.startOf('day')
					.add(this.toUnits(period[0]), number[0]);

				var keyword = query
					.replace(numberRegexp, '')
					.replace(periodRegexp, '');

				this.set({
					'from' : from, 
					'to' : to, 
					'keyword': this.reduce(keyword)});

			} else {
				this.set('from', moment().startOf('day').add('days', 1));
				this.set('to', moment().startOf('day').add('days', 3));
				this.set('keyword', this.reduce(query));
			}
		},

		reduce: function(keyword) {
			if (keyword) {

				var filtered = _.filter(
					keyword.split(' '), 
					function(word) {
						// filter out shorter than 3
						return word.length > 3;
					});

				var reduced = undefined;
				if (filtered.length > 0) {
					reduced = _.reduce(
						filtered,
						function(sum, word) {
							return (sum + ' ' + word).trim();
						});
				}
	
				return reduced;

			}
		},

		toUnits: function(period) {
			if (period.toLowerCase().indexOf('d') == 0) {
				return 'days';
			} else if (period.toLowerCase().indexOf('m') == 0) {
				return 'months';
			} else if (period.toLowerCase().indexOf('w') == 0) {
				return 'weeks';
			}
		}
	});



	/**
	 * View for search bar.
	 */
	Search.Views.Model = Backbone.View.extend({
		template: _.template(HtmlModel),

		events: {
			'click #search' : 'searchClick'
		},
		
		afterRender: function() {
			$('#query').val(this.options.query);
		},

		searchClick: function() {

			var query = $('#query').val();
			if (query) {
				query = query.trim();
			}

			Backbone.history.navigate(
				'search?q=' + query, 
				{trigger: true});
			
			return false;
		}
	});
	

	return Search;
});