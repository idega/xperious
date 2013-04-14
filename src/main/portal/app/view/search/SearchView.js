define([
   'app',
   'view/search/SearchPreferencesView',
   'view/search/SearchResultsView',
   'view/site/HeaderView',
   'view/site/QuestionsView',
   'view/site/FooterView',
   'view/site/BottomView'
],function(
	app,
	SearchPreferencesView,
	SearchResultsView,
	HeaderView,
	QuestionsView,
	FooterView,
	BottomView) {


	return Backbone.View.extend({

		template: 'search/search',

		initialize: function() {
			app.trigger('change:title', 'Suggestions - xperious');

			this.setViews({
				'.search-preferences-view' : new SearchPreferencesView(),
				'.search-results-view' : new SearchResultsView(),
				'.header-view' : new HeaderView(),
				'.questions-view' : new QuestionsView(),
				'.footer-view' : new FooterView(),
				'.bottom-view' : new BottomView()
			});
		},

		beforeRender: function() {
			$(window).scrollTop(0);
		},
		
		afterRender: function() {
			$(".custom-checkbox").button();

			var $tooltipLeft = $('<div class="tooltip"><span class="sp"><br/></span><span class="value"></span></div>').css({
				position: 'absolute',
				top: -25
			}),
			$tooltipRight = $tooltipLeft.clone();

			var $slider = $("#budget-slider"),
				sliderFrom = app.router.models.preferences.get('budget').from,
				sliderTo = app.router.models.preferences.get('budget').to,
				sliderMin = $slider.data('min'),
				sliderMax = $slider.data('max');

			$slider.slider({
					range: true,
					min: sliderMin,
					max: sliderMax,
					values: [sliderFrom, sliderTo],
					change: function(event, ui) {
						app.router.models.preferences.set('budget', {
							from: $slider.slider('values')[0],
							to: $slider.slider('values')[1],
						});
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
		}
	});

});