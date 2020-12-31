(function () {
    if ($('.lower-ie').length) {
        return;
    }
    document.getElementById('nav-index').className = 'active';
})();

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
