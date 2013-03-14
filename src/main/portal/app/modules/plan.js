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
			includeInJSON: true
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
		model: Plan.Model,

		selected: function(plan) {
			if (plan) {
				this.selectedPlan = plan;
				app.trigger('change:selected');
			} else {
				return this.selectedPlan 
					? this.selectedPlan 
					: this.at(0);
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