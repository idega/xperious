define([
	"app"
], function(app) {
	

    var $window = $(window);
	

	function centerContainerImages(selector) {
        var windowHeight = $window.height(),
            windowWidth = $window.width(),
            changeWidth = false,
            changeHeight = false;
        $(selector).each(function() {
            var $img = $(this);
            if ($img.width() < windowWidth) {
                changeWidth = true;
                $img.width(windowWidth);
            }
            if ($img.height() < windowHeight) {
                changeHeight = true;
                $img.height(windowHeight);
            }
            if (changeHeight && !changeWidth) {
                $img.css({
                    'width': 'auto'
                });
            }
            if (changeWidth && !changeHeight) {
                $img.css({
                    'height': 'auto'
                });
            }

            if ($img.height() > windowHeight) {
                $img.css({
                    marginTop: -($img.height() / 2)
                });
            }

            if ($img.width() >= windowWidth) {
                $img.css({
                    marginLeft: -($img.width() / 2)
                });
            }else{
                $img.css({
                    marginLeft: 0
                });
            }
            $img.css({
                visibility: 'visible'
            });
        });
    }
	

    function centerSliderImages() {
        centerContainerImages(".slider-container img:visible");
        $window.resize(function() {
            centerContainerImages(".slider-container img:visible");
        });
    };


	function initSlider(nextSelector, prevSelector, imagesSelector, startingZIndex) {
	    startingZIndex = startingZIndex || -1;
	    var $images = $(imagesSelector),
	        $nextButton = $(nextSelector),
	        $prevButton = $(prevSelector);
	
	    function sliderCallback(direction) {
	        $nextButton.off();
	        $prevButton.off();
	        var $img = $images.find('img:visible'),
	            $next = $images.find('img:visible')[direction]();
	        if (!$next.length || !$next.is('img')) {
	            $next = $images.find(direction == 'prev' ? 'img:last' : 'img:first');
	        }
	        $img.css({
	            'z-index': startingZIndex
	        });
	        $images.imagesLoaded(function imagesLoadedCallback() {
	            centerSliderImages();
	            $img.fadeOut(600, function fadeoutAfterImageLoadedCallback() {
	                $nextButton.on('click', sliderNextCallback);
	                $prevButton.on('click', sliderPrevCallback);
	            });
	        });
	        $next.css({
	            'z-index': startingZIndex - 1
	        }).show();
	        return false;
	    }
	
	    function sliderNextCallback() {
	        sliderCallback.call(this, 'next');
	        return false;
	    }
	    $nextButton.on('click', sliderNextCallback);
	
	    function sliderPrevCallback() {
	        sliderCallback.call(this, 'prev');
	        return false;
	    }
	    $prevButton.on('click', sliderPrevCallback);
	};


	return {
		initSlider: initSlider,
		centerSliderImages: centerSliderImages
	};
});