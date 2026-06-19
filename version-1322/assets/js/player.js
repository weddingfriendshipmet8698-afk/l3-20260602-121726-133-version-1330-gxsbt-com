import { H as Hls } from './hls-dru42stk.js';

document.querySelectorAll('[data-player]').forEach(function (stage) {
    var video = stage.querySelector('video');
    var cover = stage.querySelector('.player-cover');
    var source = stage.getAttribute('data-video-src');
    var ready = false;
    var hls = null;

    function loadSource() {
        if (ready || !video || !source) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }

        ready = true;
    }

    function startPlay() {
        loadSource();
        stage.classList.add('is-playing');

        if (cover) {
            cover.hidden = true;
        }

        if (video) {
            video.controls = true;
            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    video.controls = true;
                });
            }
        }
    }

    if (cover) {
        cover.addEventListener('click', startPlay);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlay();
            }
        });
    }

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
});
