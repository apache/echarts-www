$(document).ready(function () {
    if (location.host !== 'echarts.apache.org') {
		var banner = document.getElementById('apache-banner');
		if (banner) {
			banner.style.display = 'block';
		}
    }

    // close apache banner when found in cookie
    var isClosedStr = Cookies.get('apache-banner-closed');
    if (isClosedStr === 'true') {
        closeApacheBanner(false);
    }

    // generate nav for pages
    var $detail = $('.page-detail h2');
    if ($detail.length > 0) {
        // has title in detail
        $detail.each(function (i) {
            var link = 'href="#' + $(this).attr('id') + '"';
            var title = $(this).text();
            if ($(this).next('.time')) {
                // add time for change log page
                title += ' ' + $(this).next('.time').text();
            }
            var className = i === 0 ? ' class="active"' : ' ';
            var $a = $('<a ' + link + className + '>' + title + '</a>')
                .click(function () {
                    $('.page-nav a').removeClass('active');
                    $(this).addClass('active');
                });
            $('.page-nav ul')
                .append(
                    $('<li></li>').append($a)
                );
        });
    }

    // lazy loading iframes
    var $area = $('.page-content');
    var $iframes = $area.find('iframe');
    function lazyload() {
        $iframes.filter(function () {
            var $this = $(this);
            if ($this.attr('src')) {
                return false;
            }
            var rect = $this[0].getClientRects();
            return rect.length > 0 && rect[0].top > 0
                && rect[0].top < $(window).height();
        }).each(function () {
            $(this).attr('src', $(this).data('src'));
        });
    }
    lazyload();
    $(window).scroll(function () {
        lazyload();
    });

    // toggle nav sliding for mobile
    $('.slide-btn').click(function () {
        var $content = $(this).parent().parent();
        if ($content.hasClass('slide-up')) {
            // slide down
            $(this).text('收起目录');
            $content.removeClass('slide-up');
        }
        else {
            // slide up
            $(this).text('展开目录');
            $content.addClass('slide-up');
        }
    });

    // single page nav fixed position
    if ($('.page-nav')) {
        $(window).scroll(function () {
            var defaultTop = 120;
            var top = Math.max(120 - (window.pageYOffset - defaultTop), 70);
            $('.page-nav').css('top', top);
        });
    }
});

function changeLang(lang) {
    if (lang === 'en') {
        if (location.hostname !== 'echarts.apache.org') {
            var re = new RegExp('/zh/', 'g');
            var pathname = location.pathname.replace(re, '/en/');

            var url = 'https://echarts.apache.org' + pathname
                + location.search + location.hash;
            location.href = url;
            return;
        }
    }
    location.href = location.href.replace(
        new RegExp('/(zh|en)/', 'g'), '/' + lang + '/'
    );
}

function closeApacheBanner(isManualClose) {
    var banner = document.getElementById('apache-banner');
    banner && banner.remove();

    if (isManualClose) {
        _hmt.push(['_trackEvent', 'apacheBanner', 'close']);
        Cookies.set('apache-banner-closed', 'true', {
            expires: 7
        });
    }
}

function logApache() {
    _hmt.push(['_trackEvent', 'apacheBanner', 'visit']);
}

// Modified from https://github.com/js-cookie/js-cookie
(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}
        window.Cookies = api;

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
})();
