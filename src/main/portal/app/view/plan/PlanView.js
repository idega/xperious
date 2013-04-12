define([
   'app',
   'view/plan/PlanDayView',
   'view/site/HeaderView',
   'view/site/QuestionsView',
   'view/site/FooterView',
   'view/site/BottomView'
],function(
	app,
	PlanDayView,
	HeaderView,
	QuestionsView,
	FooterView,
	BottomView) {


	return Backbone.View.extend({

		template: 'plan/plan',


		events: {
			'click a.day-element' : 'popup',
			'click .thumbs-holder a' : 'thumb'
		},
		

		initialize: function() {
			this.setViews({
				'.header-view' : new HeaderView(),
				'.questions-view' : new QuestionsView(),
				'.footer-view' : new FooterView(),
				'.bottom-view' : new BottomView()
			});
			app.router.collections.plans.on('reset', this.render, this);
			app.trigger('change:title', 'Itinerary - xperious');
		},


		cleanup: function() {
			app.router.collections.plans.off('reset', this.render, this);
		},


		popup: function(e) {
			var index = $(e.currentTarget).data('index');
			var items = this.plan().itemsByDays().value()[index];
			new PlanDayView({index: index, items: items}).render(); 
		},


		plan: function() {
			return app.router.collections.plans.at(app.router.models.preferences.get('index'));
		},


		serialize: function() {
			// plan will only become available when collection is fetch
			// it is possible that view is being rendered when the plan
			// is not available yet
			if (this.plan()) {
				var days = [];
				this.plan().itemsByDays().each(function(items) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].get('type') === 'PRODUCT') {
							days.push({
								description: items[i].summary(),
								image: items[i].summaryImage()
							});
							break;
						}
					}
				});

				return {
					prefs: app.router.models.preferences.toJSON(),
					plan: this.plan().toJSON(), 
					days: days
				};
			}
		},


		afterRender: function() {
			if (this.plan()) {
				var plan = this.plan();
	
				this.$('.thumbs-holder').jcarousel({
					wrap: 'circular',
					scroll: 4,
					buttonNextHTML: null,
					buttonPrevHTML: null,
		            itemFallbackDimension: 100,
		            initCallback: function(carousel) {
						$(".controls .prev").click(function() {
							carousel.prev();
							return false;
						});

						$(".controls .next").click(function() {
							carousel.next();
							return false;
						});
					}
				});
	

				this.$('.thumbs-holder a').each(_.bind(function(index, e) {
					if (this.parseVimeo(e.href)) {
						this.vimeoThumb(e);
					} else if (this.parseYoutube(e.href)) {
						this.youtubeThumb(e);
					} else {
						$(e).append('<div class="zoom"><br></div>');
					}
				}, this));
	
	
				require(['google'], _.bind(function(google) {
	
					var map = new google.maps.Map(
						this.$('.map-holder')[0], {
							zoom: 6,
							center: new google.maps.LatLng(64.942160, -18.544922),
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							streetViewControl: false
					});
	
					plan.get('items').each(function(item) {
						new google.maps.Marker({
							 position: new google.maps.LatLng(
								item.get('address').latitude, 
								item.get('address').longitude),
							 title: item.get('title'),
							 map: map
						 });
					});
				}, this));
			}
		},
		

		thumb: function(e) {
			var media = this.$('.media-holder');
			var prev = media.find('img, iframe');
			prev.addClass('current-image');

			var html = this.embed(e.currentTarget.href);
			media.imagesLoaded(function() {
				prev.fadeOut(function() {
					prev.remove();
					html.removeClass('new-image');
				});
			}).prepend(html);
			return false;
		},


		parseVimeo: function(url) {
			var regExp = /http(s)?:\/\/(www\.)?vimeo.com\/(.+)($|\/)/;
			var match = url.match(regExp);
			if (match) {
				return match[3];
			}
			return false;
		},


		parseYoutube: function(url) {
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var match = url.match(regExp);
			if (match && match[7].length == 11) {
				return match[7];
			}
			return false;
		},


		vimeoThumb: function(e) {
			$.ajax({
				url: 
					'http://vimeo.com/api/v2/video/' +
						this.parseVimeo(e.href) + 
						'.json',
				dataType: 'jsonp',
				success: function(data) {
					$(e).find('img').attr('src', 
						data[0].thumbnail_medium);
					$(e).append('<div class="video"><br></div>');
				}
			});
		},


		youtubeThumb: function(e) {
			$(e).find('img').attr(
				'src', 
				'http://img.youtube.com/vi/' + 
					this.parseYoutube(e.href) +
					'/default.jpg');
			$(e).append('<div class="video"><br></div>');
		},


		embed: function(href) {
			if (this.parseVimeo(href)) {
				return $('<div class="video-wrap vimeo"><iframe src="http://player.vimeo.com/video/' + this.parseVimeo(href) + '?autoplay=1" width="780" height="380" frameborder="0"></iframe></div>');

			} else if (this.parseYoutube(href)) {
				return $('<div class="video-wrap youtube"><iframe id="ytplayer" type="text/html" width="780" height="380" src="http://www.youtube.com/embed/' + this.parseYoutube(href) +  '?autoplay=1" frameborder="0"/></div>');

			} else {
				return $('<img class="new-image" src="" style="background-image: url(' + href + ');" />"');
			}
		}

	});

});