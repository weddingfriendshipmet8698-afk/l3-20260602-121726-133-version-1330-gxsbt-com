(function () {
    window.initMoviePlayer = function (url) {
        var video = document.getElementById("moviePlayer");
        var overlay = document.getElementById("playOverlay");
        if (!video || !url) {
            return;
        }
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached) {
                return Promise.resolve();
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                return Promise.resolve();
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new Hls({ enableWorker: true });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
                return new Promise(function (resolve) {
                    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                    hlsInstance.on(Hls.Events.ERROR, function () {
                        resolve();
                    });
                });
            }
            video.src = url;
            return Promise.resolve();
        }

        function play() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            attach().then(function () {
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {});
                }
            });
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (!attached) {
                play();
            }
        });
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
