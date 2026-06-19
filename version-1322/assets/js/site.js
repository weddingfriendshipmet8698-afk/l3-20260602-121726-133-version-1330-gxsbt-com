(function () {
    var body = document.body;
    var toggle = document.querySelector('.nav-toggle');

    if (toggle) {
        toggle.addEventListener('click', function () {
            var open = body.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    document.querySelectorAll('.hero-carousel').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
                slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
                dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });

        show(0);
        restart();
    });

    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var count = document.querySelector('[data-search-count]');
    var empty = document.querySelector('[data-no-results]');

    function applySearch(value) {
        var query = (value || '').trim().toLowerCase();
        var visible = 0;

        cards.forEach(function (card) {
            var text = [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-tags')
            ].join(' ').toLowerCase();
            var matched = !query || text.indexOf(query) !== -1;

            card.hidden = !matched;
            if (matched) {
                visible += 1;
            }
        });

        if (count) {
            count.textContent = String(visible);
        }

        if (empty) {
            empty.classList.toggle('show', visible === 0);
        }
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';

        searchInput.value = initial;
        applySearch(initial);

        searchInput.addEventListener('input', function () {
            applySearch(searchInput.value);
        });
    }
})();
