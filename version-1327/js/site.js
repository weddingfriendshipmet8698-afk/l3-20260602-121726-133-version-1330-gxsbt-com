(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (!slides.length || !dots.length) {
            return;
        }
        var index = 0;
        function show(nextIndex) {
            index = nextIndex % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var next = Number(dot.getAttribute("data-hero-dot"));
                show(next);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var search = panel.querySelector("[data-movie-search]");
            var year = panel.querySelector("[data-filter-year]");
            var type = panel.querySelector("[data-filter-type]");
            var category = panel.querySelector("[data-filter-category]");
            var container = panel.parentElement;
            var cards = Array.prototype.slice.call(container.querySelectorAll("[data-movie-card]"));
            function apply() {
                var query = search ? search.value.trim().toLowerCase() : "";
                var yearValue = year ? year.value : "";
                var typeValue = type ? type.value : "";
                var categoryValue = category ? category.value : "";
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var matchesQuery = !query || text.indexOf(query) !== -1;
                    var matchesYear = !yearValue || card.getAttribute("data-year") === yearValue;
                    var matchesType = !typeValue || card.getAttribute("data-type") === typeValue;
                    var matchesCategory = !categoryValue || card.getAttribute("data-category") === categoryValue;
                    card.classList.toggle("is-hidden", !(matchesQuery && matchesYear && matchesType && matchesCategory));
                });
            }
            [search, year, type, category].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
