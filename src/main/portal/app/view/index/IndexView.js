define([
   'app',
   'view/index/destination/DestinationPopupView',
   'view/index/timeframe/TimeframeButtonView',
   'view/index/event/EventSliderView',
   'view/site/FooterView',
   'view/site/BottomView'
],function(
	app,
	DestinationPopupView,
	TimeframeButtonView,
	EventSliderView,
	FooterView,
	BottomView) {


	return Backbone.View.extend({

		template: 'index/index',

		events: {
			'click #destination' : 'destination',
			'click #plan' : 'plan',
		},

		initialize: function(options) {
			this.setViews({
				'.footer-view' : new FooterView(),
				'.bottom-view' : new BottomView({hidden: true}),
				'.timeframe-view' : new TimeframeButtonView(),
				'.events-slider .site-block' :  new EventSliderView()
			});
			app.trigger('change:title', 'Welcome - xperious');
		},

		timeframe: function() {
			var view = this.getView(function(view) {
				return view.model 
					&& view.model.has('from') 
					&& view.model.has('to');
			});
			if (view) return view.model;
		},
		
		plan: function() {
			var country = app.country();


			/* Try to parse query string and look for period
			 * in the string. Also, this normalizes query, 
			 * i.e. removes short keywords that do not have
			 * any effect. */
			var parse = this.parse(this.$('#query').val());
			var query = parse.query;
			var from = parse.from;
			var to = parse.to;


			/* Check whether timeframe was provided by the 
			 * user. Override from/to values if one was provided.*/
			var timeframe = this.timeframe();
			if (timeframe) {
				from = timeframe.get('from');
				to = timeframe.get('to');
			}

			
			/* By default use 2 guests as specified in the
			 * field placeholder. */
			var guests = this.$('#guests').val();
			if (!guests) guests = 2; 


			app.router.go(
				'search',
				query,
				country,
				from.format('YYYYMMDD'),
				to.format('YYYYMMDD'),
				guests
			);

			return false;
		},

		parse: function(query) {
			var numberRegexp = new RegExp('[1-9]+(?= *(month|week|day))', 'gi');
			var periodRegexp = new RegExp('(months|weeks|days|month|week|day)', 'gi');

			var number = query.match(numberRegexp);
			var period = query.match(periodRegexp);

			if (number || period) {
				// number not given, assume it's 1
				if (!number) number = [1]; 

				return {
					from: moment()
						.startOf('day')
						.add('days', 1),

					to: moment()
						.startOf('day')
						.add(this.toUnits(period[0]), number[0]),

					query: this.reduce(query
						.replace(numberRegexp, '')
						.replace(periodRegexp, ''))
				};

			} else {
				// default period is always one
				// week  starting from tomorrow
				return {
					from: moment()
						.startOf('day')
						.add('days', 1),

					to: moment()
						.startOf('day')
						.add('days', 7),

					query: this.reduce(query
						.replace(numberRegexp, '')
						.replace(periodRegexp, ''))
				};
			}
		},

		reduce: function(keyword) {
			if (keyword) {
				var filtered = _.filter(
					keyword.split(' '), 
					function(word) {
						// filter out shorter than 3
						return word.length > 3;
					});

				var reduced = '';
				if (filtered.length > 0) {
					reduced = _.reduce(
						filtered,
						function(sum, word) {
							return (sum + ' ' + word).trim();
						});
				}
				return reduced;
			} else {
				return '';
			}
		},

		toUnits: function(period) {
			if (period.toLowerCase().indexOf('d') == 0) {
				return 'days';
			} else if (period.toLowerCase().indexOf('m') == 0) {
				return 'months';
			} else if (period.toLowerCase().indexOf('w') == 0) {
				return 'weeks';
			}
		},

		destination: function() {
            this.insertView(new DestinationPopupView()).render();
		},
		
		afterRender: function() {

	        var $window = $(window);
            var $bottom = $('#bottom');

	        /*Placeholder for old browsers*/
	        $('input[placeholder], textarea[placeholder]').placeholder();
	
	
	        $("input.autocomplete-search-input").autocomplete({
	        	source: '/api/v1/keywords/suggest?country=is'
	        });
	
//	        if (!Modernizr.touch) {
//	            /* http://craigsworks.com/projects/qtip/ */
//	            $(".tooltip").each(function() {
//	                var config = {
//	                    content: {},
//	                    style: {
//	                        name: 'dark',
//	                        width: 285,
//	                        padding: 15,
//	                        border: {
//	                            width: 2,
//	                            radius: 2,
//	                            color: '#000000'
//	                        },
//	
//	                        tip: { // Now an object instead of a string
//	                            corner: 'topLeft', // We declare our corner within the object using the corner sub-option
//	                            color: '#000000',
//	                            size: {
//	                                x: 20, // Be careful that the x and y values refer to coordinates on screen, not height or width.
//	                                y: 20 // Depending on which corner your tooltip is at, x and y could mean either height or width!
//	                            }
//	                        }
//	                    },
//	                    position: {
//	                        adjust: {
//	                            x: -350,
//	                            y: 0
//	                        }
//	                    }
//	                },
//	                $this = $(this);
//	                if ($this.data('tooltipcontent')) {
//	                    config.content.text = $this.data('tooltipcontent');
//	                }
//	                if ($this.data('tooltiptitle')) {
//	                    config.content.title = $this.data('tooltiptitle');
//	                }
//	                $this.qtip(config);
//	            });
//	        }
	
	        $(".slider-container").imagesLoaded(centerSliderImages);
	
	
	        /* Calculate Section Height */
	        if (!Modernizr.touch) {
	            $window.resize(_.bind(function() {
	                var windowHeight = $window.height(),
	                    windowWidth = $window.width();
	                $('.full-height-section .site-block').height(windowHeight);
	                if (!this.$el.find('.landing-page').data('initialized')) {
	                    this.$el.find('.landing-page').css({
	                        display: 'none',
	                        visibility: 'visible'
	                    }).fadeIn(200, onInit);
	                }
	                $('.grid').height(windowHeight-$(".site-header").height());

	                this.$el.find('.landing-page').data('initialized', 'initialized');
	            }, this)).trigger('resize');
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