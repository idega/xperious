define([
   'app'
],function(app) {


	return Backbone.View.extend({

		template: 'site/header',

		initialize: function() {
			app.on('change:country', this.render, this);
			app.attractions.subtypes.on('reset', this.render, this);
		},

		cleanup: function() {
			app.off('change:country', this.render, this);
			app.attractions.subtypes.off('reset', this.render, this);
		},

		serialize: function() {
			return {
				country: app.countries.get(app.country()).toJSON(),
				subtypes: app.attractions.subtypes.toJSON(),
				root: app.root
			};
		},

		afterRender: function() {
			/* Initiates submenu on attraction hover */
			this.$(".menu li:has('.submenu')").hoverIntent({
	        	timeout: 300,

				over: function() {
		            $(this).find('.submenu').css({
		                opacity: 0.0,
		                display: 'block',
		                width: window.innerWidth,
		                left: -$(this).offset().left + $(this).position().left
		            }).animate({
		                opacity: 1.0
		            }, 100);

		        },

		        out: function() {
		            var $submenu = $(this).find('.submenu');
		            $submenu.css({
		                opacity: 1.0
		            }).animate({
		                opacity: 0.0
		            }, 100, function() {
		                $submenu.css({
		                    display: 'none'
		                });
		            });
		        }
			});


            /* Initiates currency converter popup */
			$('select.selectmenu-in-popup').selectmenu({
                appendTo: 'form.convert-form'
            });

            $(".convert-form .ui-widget").mouseout(function(e) {
                e.stopPropagation();
            });

	        this.$("li:has('.convert-form')").hoverIntent({
	            over: function showHovered() {
	                $(this).find('.convert-form').css({
	                    opacity: 0.0,
	                    visibility: 'visible',
	                    display: 'block'
	                }).animate({
	                    opacity: 1.0
	                }, 100);
	            },

	            out: function hideHovered(p, a, r) {
	                var $form = $(this).find('.convert-form');
	                $form.css({
	                    opacity: 1.0
	                }).animate({
	                    opacity: 0.0
	                }, 100, function() {
	                    $form.css({
	                        visibility: 'hidden',
	                        display: 'none'
	                    });
	                });
	            }

	        });

		}
	});

});