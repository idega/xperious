define([
   'app',
   'view/index/IndexViewCommons',
   'view/index/destination/DestinationPopupView',
   'view/index/timeframe/TimeframeButtonView',
   'view/index/event/EventSliderView',
   'text!templates/index/index.html'
],function(
	app,
	IndexViewCommons,
	DestinationPopupView,
	TimeframeButtonView,
	EventSliderView,
	html) {


	return Backbone.View.extend({

		template: _.template(html),

		views: {
			'.timeframe' : new TimeframeButtonView(),
			'.events-slider .site-block' : new EventSliderView(),
		},
		
		events: {
			'click a.chose-destination' : 'destination',
			'click input[value="Plan"]' : 'plan'
		},

		initialize: function() {
			_.bindAll(this);
		},

		plan: function() {
			Backbone.history.navigate(
				'search?' + 
					'query=' + $('input.autocomplete-search-input').val() + '&' +
					'country=' + app.country(),
				{trigger: true});
			return false;
		},

		destination: function() {
            this.insertView(new DestinationPopupView()).render();
		},
		
		afterRender: function() {

	        var $window = $(window),
            $body = $('body'),
            $bottom = $('#bottom');

	        /*Placeholder for old browsers*/
	        $('input[placeholder], textarea[placeholder]').placeholder();
	
	
	        $("input.autocomplete-search-input").autocomplete({
	        	source: '/api/v1/keywords/suggest?country=is'
	        });
	
	        if (!Modernizr.touch) {
	            /* http://craigsworks.com/projects/qtip/ */
	            $(".tooltip").each(function() {
	                var config = {
	                    content: {},
	                    style: {
	                        name: 'dark',
	                        width: 285,
	                        padding: 15,
	                        border: {
	                            width: 2,
	                            radius: 2,
	                            color: '#000000'
	                        },
	
	                        tip: { // Now an object instead of a string
	                            corner: 'topLeft', // We declare our corner within the object using the corner sub-option
	                            color: '#000000',
	                            size: {
	                                x: 20, // Be careful that the x and y values refer to coordinates on screen, not height or width.
	                                y: 20 // Depending on which corner your tooltip is at, x and y could mean either height or width!
	                            }
	                        }
	                    },
	                    position: {
	                        adjust: {
	                            x: -350,
	                            y: 0
	                        }
	                    }
	                },
	                $this = $(this);
	                if ($this.data('tooltipcontent')) {
	                    config.content.text = $this.data('tooltipcontent');
	                }
	                if ($this.data('tooltiptitle')) {
	                    config.content.title = $this.data('tooltiptitle');
	                }
	                $this.qtip(config);
	            });
	        }
	
	        $(".slider-container").imagesLoaded(IndexViewCommons.centerSliderImages);
	
	
	        /* Calculate Section Height */
	        if (!Modernizr.touch) {
	            $window.resize(function() {
	                var windowHeight = $window.height(),
	                    windowWidth = $window.width();
	                $('.full-height-section .site-block').height(windowHeight);
	                if (!$body.data('initialized')) {
	                    $body.css({
	                        display: 'none',
	                        visibility: 'visible'
	                    }).fadeIn(200, onInit);
	                }
	                $('.grid').height(windowHeight-$(".site-header").height());
	
	                $body.data('initialized', 'initialized');
	            }).trigger('resize');
	        }else{
	            onInit();
	        }
	
	        function onInit() {
	            $('select.selectmenu').selectmenu({
	                create: function() {
	                    if (window.PIE) {
	                        $('.ui-selectmenu, .ui-selectmenu-menu ul').each(function() {
	                            PIE.attach(this);
	                        });
	                    }
	                }
	            });
	
	            $('select.selectmenu-in-popup').selectmenu({
	                create: function() {
	                    if (window.PIE) {
	                        $('.ui-selectmenu, .ui-selectmenu-menu ul').each(function() {
	                            PIE.attach(this);
	                        });
	                    }
	                },
	                appendTo: 'form.convert-form'
	            });
	
	            $(".convert-form .ui-widget").mouseout(function(e) {
	                e.stopPropagation();
	            });
	
	            /*JS PIE. Fetures and usage: http://css3pie.com/documentation/supported-css3-features/*/
	            if (window.PIE) {
	                $('.button, .buttoned, input[type="text"], input[type="password"], textarea, .ui-selectmenu').each(function() {
	                    PIE.attach(this);
	                });
	            }
	        }
	
	        /* Slide down */
	        $('.site-bottom-menu').localScroll({
	            duration: 300,
	            easing: "swing"
	        });
	
	
	        /* Top slider */
	        IndexViewCommons.initSlider('.home-section .next', '.home-section .prev', '.slider-container');
	
	
	        /* First page bottom menus */
	        var menuAnimationTime = 100;
	        $(".site-bottom-menu li:has('.convert-form')").hoverIntent({
	            over: function showHovered() {
	                $(this).find('.convert-form').css({
	                    opacity: 0.0,
	                    visibility: 'visible',
	                    display: 'block'
	                }).animate({
	                    opacity: 1.0
	                }, menuAnimationTime);
	
	                if (window.PIE) {
	                    $(".convert-form .ui-selectmenu, .convert-form input[type='text']").each(function() {
	                        PIE.attach(this);
	                    });
	                }
	            },
	            out: function hideHovered(p, a, r) {
	                var $form = $(this).find('.convert-form');
	                $form.css({
	                    opacity: 1.0
	                }).animate({
	                    opacity: 0.0
	                }, menuAnimationTime, function() {
	                    $form.css({
	                        visibility: 'hidden',
	                        display: 'none'
	                    });
	                });
	            }
	        });
	
	        $(".site-bottom-menu li:has('.submenu')").hoverIntent(function() {
	            $(this).find('.submenu').css({
	                opacity: 0.0,
	                display: 'block',
	                width: '2000px'
	            }).animate({
	                opacity: 1.0
	            }, menuAnimationTime);
	        }, function() {
	            var $submenu = $(this).find('.submenu');
	            $submenu.css({
	                opacity: 1.0
	            }).animate({
	                opacity: 0.0
	            }, menuAnimationTime, function() {
	                $submenu.css({
	                    display: 'none'
	                });
	            });
	        });
	
	
	        $("#team").waypoint(function(dir) {
	            if (dir == 'down') {
	                $bottom.css({
	                    visibility: 'visible'
	                });
	            } else {
	                $bottom.css({
	                    visibility: 'hidden'
	                });
	            }
	        });
	
	        $(".trigger-input-animation").on('focus', function(){
	            $('#plan-inputs-container').animate({
	                width:313
	            }, 500);
	        });
	
		}
	});

});