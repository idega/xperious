define([
   'app',
   'modules/plan',
   'text!templates/index/index.html',
   'jquery.fancybox',
   'jquery.hoverIntent',
   'jquery.imagesloaded',
   'jquery.jcarousel',
   'jquery.localScroll',
   'jquery.placeholder',
   'jquery.qtip',
   'jquery.scrollTo',
   'jquery.ui',
   'jquery.ui.selectmenu',
   'jquery.waypoints',
   'modernizr'
],function(
	app,
	Plan,
	HtmlIndex) 
{
	
	var Index = app.module();

	
	Index.Views.DestinationMap = Backbone.View.extend({

		defaultIcon: '/app/images/map-pin.png',

		/**
		 * Supported countries data.
		 */
		markers: _.chain([
	        {
	        	code: 'uk',
	        	title: 'United Kingdom',
	        	icon: '/app/images/map-uk.png',
	        	lat: 51.5171,
	        	lng: -0.1062
	        },
	        {
	        	code: 'is',
	        	title: 'Iceland',
	        	icon: '/app/images/map-is.png',
	        	lat: 64.787583,
	        	lng: -18.413086  
	        }
        ]),

		afterRender: function() {
			var that = this;

			require(['google'], function(google) {
				var map = new google.maps.Map(
					$('.map-holder')[0], {
						zoom: 3,
						center: new google.maps.LatLng(62.262171, -15.249023),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						mapTypeControl: false,
						streetViewControl: false
				});

				that.markers.each(function(descriptor) {
					 var marker = new google.maps.Marker({
						 position: new google.maps.LatLng(descriptor.lat, descriptor.lng),
						 title: descriptor.title,
						 icon: that.defaultIcon,
						 map: map
					 });
					 descriptor.marker = marker;
					 
					 if (descriptor.code === app.country()) {
						descriptor.marker.setIcon(descriptor.icon);
					 }
				});

				that.markers.each(function(descriptor) {
					 google.maps.event.addListener(
						 descriptor.marker, 
						 'click', 
						 function() {
							 that.resetMarkers();
							 descriptor.marker.setIcon(descriptor.icon);
							 app.country(descriptor.code);
						 });
				 });
			});

		},

		resetMarkers: function() {
			var that = this;
			this.markers.each(function(descriptor) { 
				 descriptor.marker.setIcon(that.defaultIcon);
			});
		}
	});
	


	Index.Views.Model = Backbone.View.extend({
		template: _.template(HtmlIndex),

		events: {
			'click input[value="Plan"]' : 'plan'
		},

		plan: function() {
			Backbone.history.navigate(
				'search?' + 
					'query=' + $('input.autocomplete-search-input').val() + '&' +
					'country=' + app.country(),
				{trigger: true});
			return false;
		},

		renderDestinationMap: function() {
            this.insertView(new Index.Views.DestinationMap()).render();
		},
		
		afterRender: function() {

			var that = this;


			
			jQuery.fn.shorten = function(settings) {
			    var config = {
			        showChars: 100,
			        ellipsesText: "...",
			        moreText: "More info",
			        lessText: "less"
			    };

			    if (settings) {
			        $.extend(config, settings);
			    }

			    $('body').on('click', '.morelink', function() {
			        var $this = $(this);
			        if ($this.hasClass('less')) {
			            $this.removeClass('less');
			            $this.html(config.moreText);
			        } else {
			            $this.addClass('less');
			            $this.html('');
			        }
			        $this.parent().prev().slideDown();
			        $this.prev().slideDown();
			        return false;
			    });

			    return this.each(function() {
			        var $this = $(this);

			        var content = $this.html();
			        if (content.length > config.showChars) {
			            var c = content.substr(0, config.showChars);
			            var h = content.substr(config.showChars, content.length - config.showChars);
			            var html = c + '<span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="javascript://nop/" class="morelink show-more">' + config.moreText + '</a></span>';
			            $this.html(html);
			            $(".morecontent span").hide();
			        }
			    });
			};
			

			var $window = $(window),
            $body = $('body'),
            $bottom = $('#bottom');
        /*Placeholder for old browsers*/
        $('input[placeholder], textarea[placeholder]').placeholder();

        $("a.chose-destination").fancybox({
            hideOnContentClick: false,
            padding: 0,
            onStart: function() {
                $('#fancybox-close').text('Close');
                $("#fancybox-outer").removeClass('event-lightbox');
                that.renderDestinationMap();
            }
        });

        /* http://jqueryui.com/autocomplete/ */
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

                if ($img.width() > windowWidth) {
                    $img.css({
                        marginLeft: -($img.width() / 2)
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
        }

        $(".slider-container").imagesLoaded(centerSliderImages);

        /* Calculate Section Height */
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
            $body.data('initialized', 'initialized');
        }).trigger('resize');

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
        initSlider('.home-section .next', '.home-section .prev', '.slider-container');

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
        }

        /*Events slider*/
        $("#events-slider").jcarousel({
            scroll: 1,
            wrap: 'circular'
        });

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

        $('.event-link').on('click', function() {
            var $trigger = $(this);
            $.fancybox({
                //TODO: load content via AJAX, etc
                content: $('#event-popup').html(),
                padding: 0,
                overlayShow: false,
                onStart: function() {
                    $("#fancybox-outer").addClass('event-lightbox');
                    $('#fancybox-close').text('Close');
                },
                onComplete: function() {
                    initSlider('#fancybox-content .popup-gallery-fader .next',
                        '#fancybox-content .popup-gallery-fader .prev',
                        '#fancybox-content .popup-gallery-fader', 1103, false);
                    $(".event-popup p.info").shorten();
                    initHovers();
                    if (window.PIE) {
                        $('.popup-gallery-fader, .event-popup, .event-lightbox, .button-ticket').each(function() {
                            PIE.attach(this);
                        });
                    }
                }
            });
            return false;
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

        function hoverCallback() {
            var $this = $(this);
            $this.toggleClass('hovered', 200, 'swing');
        }

        function initHovers() {
            $('input[type="submit"], a').hoverIntent({
                over: hoverCallback,
                out: hoverCallback,
                interval: 25
            });
        }
        initHovers();
			
			

        
			
		}

	});


	return Index;

});