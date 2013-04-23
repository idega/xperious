define([
   'app'
],function(app) {


	return Backbone.View.extend({

		template: 'site/header',
		
		events: {
			'click #logo' : 'logo'
		},
		
		logo: function() {
			app.router.go('', {trigger: true});
		},
		
		afterRender: function() {
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