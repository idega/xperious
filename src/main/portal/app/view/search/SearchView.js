define([
   'app',
   'view/search/SearchResultsView'
],function(
	app,
	SearchResultsView) {


	return Backbone.View.extend({

		template: 'search/search',


		beforeRender: function() {
			app.trigger('change:title', 'Suggestions - xperious');
			$(window).scrollTop(0);
		},

		serialize: function() {
			return {
				prefs: app.search.preferences.toJSON()
			};
		},

		afterRender: function() {
			
			// insert view only after the parent view has been rendered, this helps
			// to avoid ugly page while browser is loading all the images in 
			// random order
			this.findImages('.section').imagesLoaded(_.bind(function() {
				this.setView('.search-results-view', new SearchResultsView()).render();
			}, this));
			

			$(".custom-checkbox").button();

			var $tooltipLeft = $('<div class="tooltip"><span class="sp"><br/></span><span class="value"></span></div>').css({
				position: 'absolute',
				top: -25
			}),
			$tooltipRight = $tooltipLeft.clone();

			var $slider = $("#budget-slider"),
				sliderFrom = app.search.preferences.get('budget').from,
				sliderTo = app.search.preferences.get('budget').to,
				sliderMin = $slider.data('min'),
				sliderMax = $slider.data('max');

			$slider.slider({
					range: true,
					min: sliderMin,
					max: sliderMax,
					values: [sliderFrom, sliderTo],
					change: function(event, ui) {

						// set new budget preferences
						app.search.preferences.set('budget', {
							from: $slider.slider('values')[0].toString(),
							to: $slider.slider('values')[1].toString(),
						});

						// update url to indicate new budget
						app.router.url(
							'search',
							app.search.preferences.get('query'),
							app.search.preferences.get('country'),
							app.search.preferences.get('from').format('YYYYMMDD'),
							app.search.preferences.get('to').format('YYYYMMDD'),
							app.search.preferences.get('guests'),
							app.search.preferences.get('budget').from,
							app.search.preferences.get('budget').to
						);

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