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

	
	var SearchPreferences = Backbone.Model.extend({

		initialize: function() {
			this.on('change:query', this.parse, this);
			this.set('country', app.country());
			this.set('guests', 2);
			this.set('query', '');
		},

		parse: function() {
			var numberRegexp = new RegExp('[1-9]+(?= *(month|week|day))', 'gi');
			var periodRegexp = new RegExp('(months|weeks|days|month|week|day)', 'gi');

			var number = this.get('query').match(numberRegexp);
			var period = this.get('query').match(periodRegexp);

			if (number || period) {
				// number not given, assume it's 1
				if (!number) number = [1]; 

				this.set('from', moment()
					.startOf('day')
					.add('days', 1));

				this.set('to', moment()
					.startOf('day')
					.add(this.toUnits(period[0]), number[0]));

				this.set({query : 
					this.reduce(this.get('query')
							.replace(numberRegexp, '')
							.replace(periodRegexp, ''))}, 
					{silent: true});

			} else {
				// default period is always one
				// week  starting from tomorrow
				this.set('from', moment()
					.startOf('day')
					.add('days', 1));

				this.set('to', moment()
					.startOf('day')
					.add('days', 7));

				this.set(
					{query : this.reduce(this.get('query'))},
					{silent: true});
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
		}
	});


	return Backbone.View.extend({

		template: 'index/index',
		
		preferences: new SearchPreferences(),

		events: {
			'click #destination' : 'destination',
			'click #plan' : 'plan',
		},

		initialize: function() {
			this.setViews({
				'.footer-view' : new FooterView(),
				'.bottom-view' : new BottomView({hidden: true}),
				'.timeframe-view' : new TimeframeButtonView(),
				'.events-slider .site-block' :  new EventSliderView()
			});

			app.on('change:timeframe', this.timeframe, this);
		},

		cleanup: function() {
			app.off('change:timeframe', this.timeframe, this);
		},

		timeframe: function() {
			var view = this.getView(function(view) {
				return view.model 
					&& view.model.has('from') 
					&& view.model.has('to');
			});
			if (view) {
				this.preferences.set('to', view.model.get('to'));
				this.preferences.set('from', view.model.get('from'));
			}
		},
		
		guests: function() {
			var guests = this.$('#guests').val();
			if (guests) this.preferences.set('guests', guests);
		},

		query: function() {
			this.preferences.set('query', this.$('#query').val());
		},
		
		plan: function() {
			this.query();
			this.timeframe();
			this.guests();			
			app.router.go(
				'search',
				this.preferences.get('query'),
				this.preferences.get('country'),
				this.preferences.get('from').format('YYYYMMDD'),
				this.preferences.get('to').format('YYYYMMDD'),
				this.preferences.get('guests')
			);
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