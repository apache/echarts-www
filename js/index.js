(function () {
    if ($('.lower-ie').length) {
        return;
    }
    document.getElementById('nav-index').className = 'active';
    var defaultEle = $('.navbar-default');
    defaultEle.addClass('navbar-bg');

    $(window).scroll(function () {
        if (window.pageYOffset > 600) {
            defaultEle.removeClass('navbar-bg');
        }
        else {
            defaultEle.addClass('navbar-bg');
        }
    });

    var charts = null;

    resize();
    $(window).resize(resize);

    function resize() {        // home video
        var video = document.getElementById('video-index');
        if (window.innerWidth / window.innerHeight < 16 / 9) {
            video.style.height = window.innerHeight + 'px';
            video.style.width = 'auto';
            video.style.marginLeft = Math.floor((window.innerWidth
                - window.innerHeight / 9 * 16) / 2) + 'px';
            video.style.marginTop = 0;
        }
        else {
            video.style.width = window.innerWidth + 'px';
            video.style.height = 'auto';
            video.style.marginTop = Math.floor((window.innerHeight
                - window.innerWidth / 16 * 9)) + 'px';
            video.style.marginLeft = 0;
        }
        if (charts) {
            for (var i = charts.length - 1; i >= 0; --i) {
                charts[i].resize();
            }
        }
    }

    var companyLeft = 0;
    var companyTotalWidth = 0;
    var companyLoaded = false;

    moveCompany();

    function moveCompany() {
        requestAnimationFrame(function () {
            // compute total width
            if (!companyLoaded) {
                companyTotalWidth = 0;
                var companyImages = $('.companies img');
                var loadedCompanyImages = companyImages.filter('.loaded');
                companyLoaded = loadedCompanyImages.length === companyImages.length;
                for (var i = 1, len = loadedCompanyImages.length; i < len - 3; ++i) {
                    companyTotalWidth += loadedCompanyImages[i].width + (i === len - 4 ? 60 : 30);
                }
            }
            companyLeft += 1;
            if (companyLeft > companyTotalWidth) {
                companyLeft = 0;
            }
            $('.companies').scrollLeft(companyLeft);

            moveCompany();
        });
    }
})();

var recommendId = 3;
setInterval(function () {
    recommend(recommendId);
    ++recommendId;
    if (recommendId === $('.recommend').length) {
        recommendId = 0;
    }
}, 3000);

function recommend(id) {
    recommendId = id;

    var left = $('.people img').eq(0).remove();
    $('.people').append(left);
    $('.people img').removeClass('active');
    $('.people img').eq(2).addClass('active');

    $('.recommend').removeClass('active');
    $('.recommend').eq(id).addClass('active');
}

function renderHomepage3TouchDemo(echarts) {

}

function playVideo(id) {
    var video = document.getElementById(id);
    video && video.play();

    var playBtn = document.getElementById(id + '-play');
    playBtn && (playBtn.style.display = 'none');

    var pauseBtn = document.getElementById(id + '-pause');
    pauseBtn && (pauseBtn.style.display = 'block');
}

function pauseVideo(id) {
    var video = document.getElementById(id);
    video && video.pause();

    var playBtn = document.getElementById(id + '-play');
    playBtn && (playBtn.style.display = 'block');

    var pauseBtn = document.getElementById(id + '-pause');
    pauseBtn && (pauseBtn.style.display = 'none');
}
