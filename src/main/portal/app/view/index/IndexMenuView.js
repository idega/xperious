define([
   'app',
   'view/index/destination/DestinationPopupView'
],function(
	app,
	DestinationPopupView) {


	return Backbone.View.extend({

		template: 'index/menu',
		

		initialize: function() {
			app.attractions.subtypes.on('reset', this.render, this);
		},
		

		cleanup: function() {
			app.attractions.subtypes.off('reset', this.render, this);
		},

		
		serialize: function() {
			return {
				country: app.countries.get(app.country()).toJSON(),
				subtypes: app.attractions.subtypes.toJSON()
			};
		},
		
		afterRender: function() {

	        this.$('.site-bottom-menu').localScroll({
	            duration: 300,
	            easing: "swing"
	        });


	        var menuAnimationTime = 100;
	        this.$(".site-bottom-menu li:has('.convert-form')").hoverIntent({
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
	
	        this.$(".site-bottom-menu li:has('.submenu')").hoverIntent(function() {
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
	        
	        
            this.$('input[type="submit"], a').hoverIntent({
                over: function() {
                	$(this).toggleClass('hovered', 0, 'swing');
                },
                out: function() {
                	$(this).toggleClass('hovered', 0, 'swing');
                },
                interval: 0
            });
		}

	});

});