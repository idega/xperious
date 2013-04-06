define([
   'app',
   'view/site/QuestionsView',
   'view/site/FooterView',
   'view/site/BottomView',
   'text!templates/search/search.html'
],function(
	app,
	QuestionsView,
	FooterView,
	BottomView,
	html) {


	return Backbone.View.extend({
		template: _.template(html),

		initialize: function() {
			this.setViews({
				'.questions-view' : new QuestionsView(),
				'.footer-view' : new FooterView(),
				'.bottom-view' : new BottomView()
			});
		},

		afterRender: function() {

			var $body = $('body');

			//Package filter UI
			$(".custom-checkbox").button();

			var $tooltipLeft = $('<div class="tooltip"><span class="sp"><br/></span><span class="value"></span></div>').css({
				position: 'absolute',
				top: -25
			}),
				$tooltipRight = $tooltipLeft.clone();

			var $slider = $("#budget-slider"),
				sliderFrom = $slider.data('from'),
				sliderTo = $slider.data('to'),
				sliderMin = $slider.data('min'),
				sliderMax = $slider.data('max');

			$slider.slider({
				range: true,
				min: sliderMin,
				max: sliderMax,
				values: [sliderFrom, sliderTo],
				slide: function(event, ui) {
					changeTooltipValue($tooltipLeft, ui.values[0]);
					changeTooltipValue($tooltipRight, ui.values[1]);
				}
			}).find(".ui-slider-handle:first").append($tooltipLeft)
			.end()
			.find('.ui-slider-handle:last').append($tooltipRight);
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