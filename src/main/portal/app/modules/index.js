define([
   'app',
   'modules/plan',
   'text!templates/index/index.html',
   'text!templates/index/timeframe.html',
   'text!templates/index/calendar.html',
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
	indexHtml,
	timeframeHtml,
	calendarHtml) 
{
	
	var Index = app.module();


	/**
	 * Traveling destination selection control (popup).
	 */
	Index.Views.Destination = Backbone.View.extend({

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
			require(['google'], _.bind(function(google) {
				var map = new google.maps.Map(
					$('.map-holder')[0], {
						zoom: 3,
						center: new google.maps.LatLng(62.262171, -15.249023),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						mapTypeControl: false,
						streetViewControl: false
				});

				this.markers.each(_.bind(function(descriptor) {
					 var marker = new google.maps.Marker({
						 position: new google.maps.LatLng(descriptor.lat, descriptor.lng),
						 title: descriptor.title,
						 icon: this.defaultIcon,
						 map: map
					 });
					 descriptor.marker = marker;
					 
					 if (descriptor.code === app.country()) {
						descriptor.marker.setIcon(descriptor.icon);
					 }
				}, this));

				this.markers.each(_.bind(function(descriptor) {
					 google.maps.event.addListener(
						 descriptor.marker, 
						 'click', 
						 _.bind(function() {
							 this.resetMarkers();
							 descriptor.marker.setIcon(descriptor.icon);
							 app.country(descriptor.code);
						 }, this));
				 }, this));

			}, this));

		},

		resetMarkers: function() {
			this.markers.each(_.bind(function(descriptor) { 
				 descriptor.marker.setIcon(this.defaultIcon);
			}, this));
		}
	});
	


	/**
	 * Timeframe period model.
	 */
	Index.Timeframe = Backbone.Model.extend({

		addDate: function(date) {
			if (this.isFrom(date)) {
				this.unset('from');
				
			} else  if (this.isTo(date)) {
				this.unset('to');
				
			} else if (!this.has('from')) {
				this.set('from', moment(date));
				
			} else {
				this.set('to', moment(date));
			}
			
			// user has switched the selection
			// invert the period so it is correct
			if (this.get('from') > this.get('to')) {
				var from = this.get('from');
				this.set('from', this.get('to'));
				this.set('to', from);
			}
		},

		hasDate: function(date) {
			return this.isFrom(date) || this.isTo(date);
		},
		
		isFrom: function(date) {
			return this.has('from') && this.get('from').diff(this.toMoment(date)) == 0;
		},

		isTo: function(date) {
			return this.has('to') && this.get('to').diff(this.toMoment(date)) == 0;
		},
		
		toMoment: function(date) {
			if (_.isString(date)) {
				return moment(date, 'YYYY-MM-DD');
			} else {
				return moment(date);
			}
		},
		
		toString: function() {
			return this.has('from') 
				? moment(this.get('from')).format('YYYY-MM-DD')
				: undefined;
		}
	});
	

	/**
	 * Control for timeframe selection.
	 */
	Index.Views.Timeframe = Backbone.View.extend({
		template: _.template(timeframeHtml),

		model: Index.Timeframe,


		events: {
			'click .ico-calendar' : 'calendar'
		},

		initialize: function() {
			this.model = new Index.Timeframe();
			app.on('change:timeframe', this.render, this);
		},

		serialize: function() {
			return {
				from : {
					day: this.model.has('from') 
						? this.model.get('from').format('DD') 
						: undefined,

					month: this.model.has('from') 
						? this.model.get('from').format('MMM') 
						: undefined
				},
				to : {
					day: this.model.has('to') 
						? this.model.get('to').format('DD') 
						: undefined,

					month: this.model.has('to') 
						? this.model.get('to').format('MMM') 
						: undefined 
				}
			};
		},

		calendar: function() {
			this.insertView(new Index.Views.Calendar({model: this.model})).render();
		}
	});


	/**
	 * Control for calendar (helps for timeframe selection).
	 */
	Index.Views.Calendar = Backbone.View.extend({
		template: _.template(calendarHtml),

		events: {
			'click .close' : 'empty'
		},

		model: Index.Timeframe,

		initialize: function() {
			_.bindAll(this);
		},

		afterRender: function() {

			this.$el.dialog({
				dialogClass: 'calendar',
				modal: true,
				resizable: false,
				minWidth: 800,
				minHeight: 400,
				open: this.open,
				close: this.empty
			});
			
			// a click outside calendar will close the window
			$('.ui-widget-overlay').bind('click', this.empty);

			// recenter the dialog on window resize
			$(window).resize(this.updatePosition);
		},
		
		open: function() {
			this.$('.datepicker').datepicker({
				dateFormat: 'yy-mm-dd',
				numberOfMonths: 2,
				firstDay: 1,
				modal: true,
				defaultDate: this.model.toString(),
				onSelect: this.onDateSelect,
                beforeShowDay: this.beforeShowDay
			});

			this.updateTitlebar();
		},

		onDateSelect: function(dateText) {
			this.model.addDate(dateText); 
			this.updateTitlebar();
			if (this.model.has('from') 
				&& this.model.has('to')) {
				this.empty();
			}			
		},

		beforeShowDay: function(day) {
    		if (moment(day).isBefore(moment(), 'day')) {
    			return [false, ""]; 
    		}
		  	if (this.model.hasDate(day)) {
		  		return [true, "ui-state-highlight"]; 
		  	}
		  	return [true, ""];
		},

		updateTitlebar: function() {
			if (this.model.has('from')) {
				this.$('.from').show();
				this.$('.from strong')
					.text(this.model
						.get('from')
						.format('MMMM D'));
			} else {
				this.$('.from').hide();
			}


			if (this.model.has('to')) {
				this.$('.to').show();
				this.$('.to strong')
					.text(this.model
						.get('to')
						.format('MMMM D'));
			} else {
				this.$('.to').hide();
			}
		},

		updatePosition: _.debounce(function() {
			this.$el.dialog("option", "position", "center");
		}, this),

		empty: function() {

			this.$('.datepicker').datepicker('destroy');
			this.$el.dialog('close');
			this.$el.remove();
			$(window).unbind('resize', this.updatePosition);
			app.trigger('change:timeframe');
		},
	});
	

	/**
	 * Main index window. Mostly imported from CSS guys.
	 * 
	 */
	Index.Views.Model = Backbone.View.extend({

		template: _.template(indexHtml),

		views: {
			'.timeframe' : new Index.Views.Timeframe()
		},
		
		events: {
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

		renderDestination: function() {
            this.insertView(new Index.Views.Destination()).render();
		},
		

		_afterRender: function() {
			
		},
		
		afterRender: function() {


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
            onStart: _.bind(function() {
                $('#fancybox-close').text('Close');
                $("#fancybox-outer").removeClass('event-lightbox');
                this.renderDestination();
            }, this)
        });


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
        }

        $(".slider-container").imagesLoaded(centerSliderImages);

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

        $(".trigger-input-animation").on('focus', function(){
            $('#plan-inputs-container').animate({
                width:313
            }, 500);
        });
			
        
        this._afterRender();
			
		}

	});


	return Index;

});