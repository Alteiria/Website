(function() {
    // Zenscroll setup

    (function() {
        zenscroll.setup(null, 50);
    })();

    // DOM-related scripts that should be run after page load

    window.onload = function() {
        // Automatically close menu when link is clicked

        (function() {
            var menuToggle = document.getElementById("menutoggle");
            var closeMenu = function() {
                menuToggle.checked = false;
            };

            var links = document.querySelectorAll("nav a");
            for (var i = 0; i < links.length; i++)
                links[i].addEventListener("click", closeMenu);
        })();

        // Automatically stick nav when scrolled to the top

        (function() {
            var nav = document.getElementsByTagName("nav")[0];
            var refreshNav = function() {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
                if (scrollTop > 0)
                    nav.classList.remove("sticked");
                else nav.classList.add("sticked");
            };

            window.addEventListener("scroll", refreshNav);
            window.addEventListener("resize", refreshNav);
            refreshNav();
        })();

        // Automatically switch Alteiria GIF

        (function() {
            var gif = document.getElementById("alteiria-text-gif");

            var img0 = new Image();
            img0.src = gif.dataset.src0;

            var attributes = gif.getAttributeNames();
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                if (attribute == "src") continue;
                img0.setAttribute(attribute, gif.getAttribute(attribute));
            }

            img0.onload = function() {
                gif.replaceWith(img0);
                gif = img0;

                var img1 = new Image();
                img1.src = gif.dataset.src1;

                var attributes = gif.getAttributeNames();
                for (var i = 0; i < attributes.length; i++) {
                    var attribute = attributes[i];
                    if (attribute == "src") continue;
                    img1.setAttribute(attribute, gif.getAttribute(attribute));
                }

                var loaded = false, delayed = false;
                img1.onload = function() {
                    loaded = true;
                    if (delayed) {
                        gif.replaceWith(img1);
                        gif = img1;
                    }
                };

                setTimeout(function() {
                    delayed = true;
                    if (loaded) {
                        gif.replaceWith(img1);
                        gif = img1;
                    }
                }, 40 * 79); // Time per frame * Number of frames (of the "pop" GIF)
            };
        })();

        // Slides parallax effect

        (function() {
            var slidesImages = {};
            var refreshParallax = function(slide, image) {
                if (!slide || !image) {
                    var slides = Object.keys(slidesImages);
                    for (var i = 0; i < slides.length; i++) {
                        var slide = document.getElementById(slides[i]);
                        var image = slidesImages[slides[i]];
                        refreshParallax(slide, image);
                    }
                    return;
                }

                var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                var height = Math.floor(image.height * windowWidth / image.width);
                var bounds = slide.getBoundingClientRect();
                var deltaY = height - windowHeight;

                if (deltaY <= 0) {
                    slide.style.backgroundPosition = "center";
                    return;
                }

                if (bounds.top >= windowHeight) {
                    // Slide is above the screen
                    slide.style.backgroundPosition = "center " + (0) + "px";
                } else if (bounds.top <= -bounds.height) {
                    // Slide is under the screen
                    slide.style.backgroundPosition = "center " + (-deltaY) + "px";
                } else {
                    // Slide is currently shown on the screen
                    var progress = (windowHeight - bounds.top) / (windowHeight + bounds.height);
                    slide.style.backgroundPosition = "center " + (-deltaY * progress) + "px";
                }
            };

            var slides = document.querySelectorAll("section, header");
            for (var i = 0; i < slides.length; i++) {
                (function(slide) {
                    var style = slide.currentStyle || window.getComputedStyle(slide, false);
                    var urlregex = /^url\(["']?([^"']*)["']?\)$/;
                    if (urlregex.test(style.backgroundImage)) {
                        var url = style.backgroundImage.replace(urlregex, "$1");
                        var image = new Image();
                        image.src = url;
                        image.onload = function() {
                            slidesImages[slide.id] = image;
                            refreshParallax(slide, image);
                        };
                    }
                })(slides[i]);
            }

            window.addEventListener("scroll", refreshParallax);
            window.addEventListener("resize", refreshParallax);
        })();
    };

    // Automatic language redirect

    (function() {
        if (!!window.navigator.doNotTrack) return;

        var location = new URL(window.location);

        if (!(!document.referrer && location.host === "") && !(!!document.referrer && new URL(document.referrer).host === location.host)) {
            var language = window.navigator.languages? window.navigator.languages[0] : (window.navigator.language || window.navigator.userLanguage);
            if (language.indexOf('-') !== -1) language = language.split('-')[0];
            if (language.indexOf('_') !== -1) language = language.split('_')[0];

            var languages = {
                "fr": ["/index.html", "/"],
                "en": ["/index.en.html"],
            };

            if (languages.hasOwnProperty(language) && !!languages[language]) {
                var page = location.pathname;
                page = page.substring(page.lastIndexOf("/"));
                if (!languages[language].includes(page)) {
                    location.pathname = languages[language][0];
                    window.location = location.toString();
                }
            }
        }
    })();
})();
