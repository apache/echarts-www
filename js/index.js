window.lazyLoadOptions = {
    elements_selector: '.lazy'
};

(function () {
    if ($('.lower-ie').length) {
        return;
    }
    document.getElementById('nav-index').className = 'active';

    var ua = navigator.userAgent;
    var ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/.+?rv:(([\d.]+))/);
    var edge = ua.match(/Edge\/([\d.]+)/);
    window.supportTouch = 'ontouchstart' in window && !ie && !edge;

    initAnimation();

    function initAnimation() {
        ScrollReveal().reveal('.reveal', {
            container: '#page-index',
            delay: 300
        });
        ScrollReveal().reveal('.reveal-later', {
            container: '#page-index',
            delay: 600
        });
        ScrollReveal().reveal('.reveal-latest', {
            container: '#page-index',
            delay: 1200
        });
        ScrollReveal().reveal('.reveal-about', {
            container: '#page-index',
            delay: 600
        });

        var animationMap = {};
        function setLottieAnimatiion(id, path) {
            var container = id;
            if (typeof id === 'string') {
                container = document.getElementById(id);
            }

            animationMap[id] = lottie.loadAnimation({
                container: container, // the dom element that will contain the animation
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: path // the path to the animation json
            });
        }
        setLottieAnimatiion('icon-1', 'asset/lottie/json/chart.json');
        setLottieAnimatiion('icon-2', 'asset/lottie/json/fly.json');
        setLottieAnimatiion('icon-3', 'asset/lottie/json/analysis.json');
        setLottieAnimatiion('icon-4', 'asset/lottie/json/compatible.json');
        setLottieAnimatiion('icon-5', 'asset/lottie/json/grown.json');
        setLottieAnimatiion('icon-6', 'asset/lottie/json/simple.json');

        for(var i = 0; i < 6; i++) {
            setLottieAnimatiion('bg-icon-' + (i + 1), 'asset/lottie/json/bg_0'+ (i + 1) + '.json');
            (function (i) {
                $('#index-feature-' + (i + 1)).mouseenter(function () {
                    animationMap['icon-' + (i + 1)].goToAndPlay(0);
                });
            })(i);
        }

        var hasStartLineShow = false;
        var hasEndLineShow = false;

        setLottieAnimatiion('paper-icon', 'asset/lottie/json/paper.json');

        $('#page-index').scroll(function () {
            var startLine = $("#start-line").offset().top;
            var endLine = $("#end-line").offset().top;

            if (startLine >= $(window).scrollTop() && startLine < ($(window).scrollTop() + $(window).height() - 200)) {
                if (!hasStartLineShow) {
                    $('#publication').css('opacity', 1);
                    if (animationMap['start-line']) {
                        animationMap['start-line'].goToAndPlay(0);
                    }
                    else {
                        setLottieAnimatiion('start-line', 'asset/lottie/json/start_line.json');
                    }

                    if (animationMap['paper-icon']) {
                        animationMap['paper-icon'].goToAndPlay(0);
                    }
                    else {
                        setLottieAnimatiion('paper-icon', 'asset/lottie/json/paper.json');
                    }
                    hasStartLineShow = true;
                }
            }
            else {
                if (!hasStartLineShow) {
                    hasStartLineShow = false;
                }
            }

            if (endLine <= 400) {
                if (!hasEndLineShow) {
                    if (animationMap['end-line']) {
                        animationMap['end-line'].goToAndPlay(0);
                    }
                    else {
                        setLottieAnimatiion('end-line', 'asset/lottie/json/end_line.json');
                    }

                    hasEndLineShow = true;
                }
            }
            else {
                if (!hasEndLineShow) {
                    hasEndLineShow = false;
                }
            }
        });
    }

    var isInited = false;

    function loadLandingAnimationScripts() {
        return new Promise((resolve) => {
            // var landingAnimationURL = 'http://localhost/echarts-www-landing-animation/'
            var landingAnimationURL = 'https://fastly.jsdelivr.net/npm/echarts-www-landing-animation/';
            // Load script.
            var link = document.createElement('link');
            var script = document.createElement('script');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');

            var loading = 2;

            function onload() {
                loading--;
                if (!loading) {
                    setTimeout(() => {
                        resolve();
                    }, 500)
                }
            }

            script.onload = onload;
            link.onload = onload;

            link.href = landingAnimationURL + 'dist/style.css';
            script.src = landingAnimationURL + 'dist/echarts-www-landing-animation.js';
            document.head.appendChild(link);
            document.head.appendChild(script);
        });
    }

    var landingAnimationPromise;
    setTimeout(() => {
        // Auto load script after 3 seconds.
        landingAnimationPromise = loadLandingAnimationScripts();
    }, 3000);

    // Index animation
    window.startMagic = function () {
        $('#play-landing-animation .loading').show();
        function start() {
            $('#play-landing-animation .loading').hide();

            var svgBoundingRect = document.querySelector('.home-landing-animation-cover svg').getBoundingClientRect();
            var rect = {
                left: svgBoundingRect.left,
                top: svgBoundingRect.top,
                width: svgBoundingRect.width,
                height: svgBoundingRect.height,
            };

            // Get rect before hiding.
            $('#main').addClass('cinematic-mode');

            document.getElementById('home-landing-animation-close-btn').onclick = function () {
                landingAnimation.pause();
                $('#main').removeClass('cinematic-mode');
            }

            if (isInited) {
                landingAnimation.resume();
            }
            else {
                landingAnimation.init(document.getElementById('home-landing-animation-viewport'), {
                    initialPieLayout: rect,
                    initialPieAnimation: false,
                    updateURLHash: false
                })
                isInited = true;
            }
        }

        if (typeof landingAnimation !== 'undefined') {
            start();
            return;
        }

        if (!landingAnimationPromise) {
            landingAnimationPromise = loadLandingAnimationScripts();
        }
        landingAnimationPromise.then(function () {
            start();
        });
    }

    $('#play-landing-animation').on('click', startMagic);
})();
