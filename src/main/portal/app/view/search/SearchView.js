define([
   'app',
   'view/search/SearchResultsView'
],function(
	app,
	SearchResultsView) {


	return Backbone.View.extend({

		template: 'search/search',


		beforeRender: function() {
			app.trigger('change:title', 'Our suggestions - xperious');
			$(window).scrollTop(0);
		},

		serialize: function() {
			return {
				prefs: app.search.pref.toJSON()
			};
		},

		afterRender: function() {
			this.findImages('.section').imagesLoaded(_.bind(function() {
				this.setView('.search-results-view', new SearchResultsView()).render();


				$(".custom-checkbox").button();
	
				var $tooltipLeft = $('<div class="tooltip"><span class="sp"><br/></span><span class="value"></span></div>').css({
					position: 'absolute',
					top: -25
				}),
				$tooltipRight = $tooltipLeft.clone();
	
				
				var budget = app.search.pref.get('budget');
				var $slider = $("#budget-slider"),
					sliderFrom = (budget.from) ? budget.from : '0',
					sliderTo = (budget.to) ? budget.to : '5000',
					sliderMin = $slider.data('min'),
					sliderMax = $slider.data('max');
	
				$slider.slider({
						range: true,
						min: sliderMin,
						max: sliderMax,
						values: [sliderFrom, sliderTo],
						change: function(event, ui) {
							// set new budget preferences
							app.search.pref.set('budget', {
								from: $slider.slider('values')[0].toString(),
								to: $slider.slider('values')[1].toString(),
							});
	
							app.router.gosearch({trigger : false});
						},
						slide: function(event, ui) {
							changeTooltipValue($tooltipLeft, ui.values[0]);
							changeTooltipValue($tooltipRight, ui.values[1]);
						}
					})
				.find(".ui-slider-handle:first")
				.append($tooltipLeft)
				.end()
				.find('.ui-slider-handle:last')
				.append($tooltipRight);
	
				changeTooltipValue($tooltipLeft, sliderFrom);
				changeTooltipValue($tooltipRight, sliderTo);
				function changeTooltipValue($element, value){
					$element.find('.value')
						.html("&euro; " + value)
						.end().css({
							'margin-left':-$element.outerWidth() / 2
						});
				}
	
				var $rating = $(".star").rating();
				$rating.rating('readOnly', true);
			
			}, this));
		}
	});

});