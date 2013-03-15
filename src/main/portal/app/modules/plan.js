define([
	'app', 
	'modules/planItem',
	'text!templates/plan/model.html',
	'text!templates/plan/collection.html'],
function(
	app, 
	PlanItem,
	HtmlModel,
	HtmlCollection)
{

	var Plan = app.module();


	/**
	 * Plan model, maps directly on API response.
	 */
	Plan.Model = Backbone.RelationalModel.extend({

		idAttribute: 'id',

		relations: [{
			type: Backbone.HasMany,
			key: 'items',
			relatedModel: PlanItem.Model,
			collectionType: PlanItem.Collection,
			includeInJSON: true,
			parse: true
		}],

		center: function() {
			if (this.get('items').size() > 0) {
				return {
					lat: this.get('items').at(0).get('latitude'),
					lng: this.get('items').at(0).get('longitude'),
				};
			}
		},
		
		toJSON: function() {
			var json = Backbone.RelationalModel.prototype.toJSON.call(this);
			json.from = moment(json.from).format('YYYY-MM-DD');
			json.to = moment(json.to).format('YYYY-MM-DD');
			return json;
		}
	});


	
	/**
	 * Plans list. Root element on API response.
	 */
	Plan.Collection = Backbone.Collection.extend({

		url: '/api/v1/plans/search',

		model: Plan.Model,

		initialize: function(models, options) {
			this.query = options.query;
			this.country = options.country;
			this.from = options.from;
			this.to = options.to;
			if (!this.from || !this.to) {
				this.build(this.query);
			}
		},

		selected: function(plan) {
			if (plan) {
				this.selectedPlan = plan;
				app.trigger('change:selected');
			} else {
				return this.selectedPlan 
					? this.selectedPlan 
					: this.at(0);
			}
		},

		fetch: function(options) {
			options = options || {};
			this._super(_.extend(options, 
				{data: {
					query: this.query,
					country: this.country,
					from: this.from,
					to: this.to
				}}
			));
			return this;
		},

		/** Whenever from/to are missing parse for period or set the defaults */
		build: function(query) {

			var numberRegexp = new RegExp('[1-9]+(?= *(month|week|day))', 'gi');
			var periodRegexp = new RegExp('(months|weeks|days|month|week|day)', 'gi');

			var number = query.match(numberRegexp);
			var period = query.match(periodRegexp);

			if (number || period) {
				if (!number) number = [1]; // number not given, guess it is 1

				this.from = moment()
					.startOf('day')
					.add('days', 1)
					.format();

				this.to = moment()
					.startOf('day')
					.add(this.toUnits(period[0]), number[0])
					.format();

				this.query = query
					.replace(numberRegexp, '')
					.replace(periodRegexp, '');

			} else {
				// default period is one week starting from tomorrow
				this.from = moment()
					.startOf('day')
					.add('days', 1)
					.format();

				this.to = moment()
					.startOf('day')
					.add('days', 7)
					.format();

				this.query = this.reduce(query);
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
	 * Renders Plan view.
	 */
	Plan.Views.Model = Backbone.View.extend({
		template: _.template(HtmlModel),
		
		initialize: function() {
			app.on('change:selected', this.render, this);
		},

		serialize: function() {
			var plan = this.model.selected().toJSON();
			return {
				plan: plan,
				items: _.chain(plan.items)
			};
		},

		afterRender: function() {
			
			var that = this;

			// dynamically load google because
			// of the optimization performed on
			// build stage
		    require(['google'], function() {

		    	var map = new google.maps.Map(
						$('#map')[0],
						{
							zoom: 5,
							center: new google.maps.LatLng(
								that.model.selected().center().lat,
								that.model.selected().center().lng),
							mapTypeId: google.maps.MapTypeId.ROADMAP
						}
					);

		    	that.model.selected().get('items').each(function(item) {
				      new google.maps.Marker(
					  {
						   position: new google.maps.LatLng(
							   item.get('latitude'), 
							   item.get('longitude')),
						   map: map,
						   title: item.get('title')
					  });
				});

		    });
			

			return this;
		},
		
		cleanup: function() {
			
		}
	});
	

	
	/**
	 * A view for plan collection.
	 */
	Plan.Views.Collection = Backbone.View.extend({
		template: _.template(HtmlCollection),

		events: {
			"click a" : "selectPlanClick"
		},

		initialize: function() {
			app.on('change:selected', this.render, this);
		},

		serialize: function() {
			return {
				plans: this.model.toJSON(),
				selected: this.model.selected() 
					? this.model.selected().id
					: undefined
			};
		},	
		
		selectPlanClick: function(event) {
			this.model.selected(this.model.get($(event.currentTarget).attr('id')));
		}
	});
	
	
	return Plan;
});