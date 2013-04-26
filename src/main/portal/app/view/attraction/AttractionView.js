define([
   'app'
],function(
	app) {


	return Backbone.View.extend({

		template: 'attraction/attraction',


		afterRender: function() {
			require(['google'], _.bind(function(google) {
				var map = new google.maps.Map(
					this.$('.map-holder')[0], {
						zoom: 6,
						center: new google.maps.LatLng(64.942160, -18.544922),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false
				});

				new google.maps.Marker({
					 position: new google.maps.LatLng(64.767522, -23.628373),
					 title: 'Arnarstapi',
					 map: map
				 });
			}, this));


			var $mediaHolder = $('.media-holder'),
			$thumbsHolder = $('.thumbs-holder'),
			$thumbs = $thumbsHolder.find('a'),
			i, el, $el;

			$thumbsHolder.on('click', 'a', function() {
				var $prevImg = $mediaHolder.find('img, iframe'),
					$newImg,
					vimeoId = parseVimeo(this.href),
					youtubeId = parseYoutube(this.href);
				$prevImg.addClass('current-image');
				if (vimeoId) {
					$newImg = $('<div class="video-wrap vimeo"><iframe src="http://player.vimeo.com/video/' + vimeoId + '?autoplay=1" width="780" height="380" frameborder="0"></iframe></div>');
				} else if (youtubeId) {
					$newImg = $('<div class="video-wrap youtube"><iframe id="ytplayer" type="text/html" width="780" height="380" src="http://www.youtube.com/embed/' + youtubeId + '?autoplay=1" frameborder="0"/></div>');
				} else {
					$newImg = $('<img class="new-image" style="background-image: url(' + this.href + ')" />');
				}
	
				$mediaHolder.imagesLoaded(function() {
					$prevImg.fadeOut(function() {
						$prevImg.remove();
						$newImg.removeClass('new-image');
					});
				}).prepend($newImg);
				return false;
			});

			$thumbsHolder.jcarousel({
				scroll: 4,
				wrap: 'circular',
				initCallback: mycarouselInitCallback,
				buttonNextHTML: null,
				buttonPrevHTML: null,
				itemFallbackDimension: 100,
			}),

			$thumbs.each(function() {
				var $el = $(this);
				if (parseVimeo(this.href) || parseYoutube(this.href)) {
					$el.append('<div class="video"><br></div>');
				} else {
					$el.append('<div class="zoom"><br></div>');
				}
			});

			function mycarouselInitCallback(carousel) {
				$(".controls .prev").on('click', function() {
					carousel.prev();
					return false;
				});
		
				$(".controls .next").on('click', function() {
					carousel.next();
					return false;
				});
			}
		
		
			function parseVimeo(url) {
				/*http://stackoverflow.com/questions/2916544/parsing-a-vimeo-id-using-javascript*/
				var regExp = /http(s)?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
		
				var match = url.match(regExp);
		
				if (match) {
					return match[3];
				}
				return false;
			}

			/*http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url*/
		
			function parseYoutube(url) {
				var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
				var match = url.match(regExp);
				if (match && match[7].length == 11) {
					return match[7];
				}
				return false;
			}

		}
	});

});