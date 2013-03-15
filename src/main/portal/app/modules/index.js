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
			'click #plan' : 'plan'
		},

		plan: function() {
			Backbone.history.navigate(
				'search?' + 
					'query=' + $('#query').val() + '&' +
					'country=' + app.country(),
				{trigger: true});
			return false;
		},

		renderDestinationMap: function() {
            this.insertView(new Index.Views.DestinationMap()).render();
		},
		
		afterRender: function() {

			var that = this;


			        /*Placeholder for old browsers*/
			        $('input[placeholder], textarea[placeholder]').placeholder();

			        $("a.chose-destination").fancybox({
			            padding: 0,
			            onStart: function() {
			                $('#fancybox-close').text('Close');
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

			        $(".animate-parent").on('click', function(event) {
			            var $this = $(this),
			                $toAnimate = $this.parent('.hidden');
			            $toAnimate.animate({
			                left: 0
			            }, 300, function() {
			            	$(".animate-parent").unbind(event);
			            });
			            return false;
			        });

			        /* Calculate Section Height */
			        var $window = $(window),
			            $body = $('body');
			        $window.resize(function() {
			            var windowHeight = $window.height();
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
			                create : function(){
			                    if (window.PIE) {
			                        $('.ui-selectmenu, .ui-selectmenu-menu ul').each(function() {
			                            PIE.attach(this);
			                        });
			                    }
			                }
			            });

			            $('select.selectmenu-in-popup').selectmenu({
			                create : function(){
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

			        /* Background video */
			        /*$(".section").each(function() {
			            var $section = $(this);
			            if ($section.data('videoid')) {
			                var $iframe = $('<div id="iframe-container"><iframe height="100%" width="100%" style="overflow-y: hidden;" src="http://player.vimeo.com/video/' + $section.data('videoid') +
			                    '?autoplay=1&loop=1&color=000000" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen scrolling="no"></iframe></div>');
			                $body.append($iframe);
			            }
			        });*/

			        /* Slide down */
			        $('.site-bottom-menu').localScroll({
			            duration: 300,
			            easing: "swing"
			        });


			        /* Top slider */
			        var $images = $('.slider-container');

			        function sliderCallback(direction, selector, callback) {
			            $(selector).unbind('click', callback);
			            var $img = $images.find(':visible'),
			                $next = $images.find(':visible')[direction]();
			            if (!$next.length) {
			                $next = $images.find(direction == 'prev' ? ':last' : ':first');
			            }
			            $img.css({
			                'z-index': -1
			            });
			            $images.imagesLoaded(function imagesLoadedCallback() {
			                $img.fadeOut(600, function fadeoutAfterImageLoadedCallback() {
			                    $(selector).bind('click', callback);
			                });
			            });
			            $next.css({
			                'z-index': -2
			            }).show();
			            return false;
			        }

			        function sliderNextCallback() {
			            sliderCallback.call(this, 'next', '.home-section .next', sliderNextCallback);
			            return false;
			        }

			        $('.home-section .next').on('click', sliderNextCallback);

			        function sliderPrevCallback() {
			            sliderCallback.call(this, 'prev', '.home-section .prev', sliderPrevCallback);
			            return false;
			        }

			        $('.home-section .prev').on('click', sliderPrevCallback);

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
			            },
			            sensitivity: 50
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
			
			
			        
			
			
			
		}

	});


	return Index;

});