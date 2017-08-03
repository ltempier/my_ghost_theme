"use strict";

(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {
        var $postContent = $(".post-content");
        $postContent.fitVids();


        try {
            postTitleProcess()
        } catch (e) {

        }


        try {
            carouselProcess()
        } catch (e) {

        }

        try {
            galleryProcess()
        } catch (e) {

        }


        //try {
        //    konamiProcess()
        //} catch (e) {
        //
        //}

    });

})(jQuery);


function imgurProcess() {

}


function konamiProcess() {
    var $items = $('.list-post-item');
    if ($items.length) {
        var $item = $($items[Math.floor(Math.random() * $items.length)]);

        $item.addClass('hovered');
        setTimeout(function () {
            $item.removeClass('hovered');
            konamiProcess()
        }, 1000)
    }
}


function postTitleProcess() {
    var $postTitle = $('.post-title');
    if ($postTitle.length) {
        checkScroll();
        window.onscroll = function (e) {
            e.preventDefault();
            checkScroll();
        };
    }

    function checkScroll() {
        var yOffset = 10;
        var currYOffSet = window.pageYOffset;
        if (yOffset < currYOffSet) {
            $postTitle.attr('class', 'post-title fixed')
        }
        else {
            $postTitle.attr('class', 'post-title')
        }
    }
}


function carouselProcess() {

    if ($('.carousel-gallery').length) {

        $('.carousel-gallery').each(function () {
            $(this).slick({
                infinite: true,
                //speed: 800,
                //fade: true,
                adaptiveHeight: true,
                //lazyLoad:"progressive",
                //autoplay: true,
                prevArrow: '<button class="btn slick-arrow slick-prev"><i class="glyphicon glyphicon-triangle-left"></i></button>',
                nextArrow: '<button class="btn slick-arrow slick-next"><i class="glyphicon glyphicon-triangle-right"></i></button>'
            });
        });

        $(document).keydown(function (e) {
            switch (e.which) {
                case 37: // left
                    $('.carousel-gallery').each(function () {
                        if ($(this).visible(false, true)) {
                            this.slick.slickPrev()
                        }
                    });
                    break;
                case 39: // right
                    $('.carousel-gallery').each(function () {
                        if ($(this).visible(false, true)) {
                            this.slick.slickNext()
                        }
                    });
                    break;
            }
        });
    }

}

var bufferGallery = 0;
function getGalleryItemWidth(div) {
    div = div || 3;
    var width = (100 / div) * _.random(1, div, false);
    if (bufferGallery + width > 100) {
        width = 100 - bufferGallery;
        bufferGallery = 0
    } else
        bufferGallery += width;
    return width
}


function galleryProcess() {

    if (_GALLERY && _GALLERY.length) {
        var $gallery = $('#gallery');


        var columnDivider = 5;
        $gallery.append('<div class="gallery-sizer" style="width:' + 100 / columnDivider + '%"></div>');
        $.each(_GALLERY, function (idx) {

            //TODO remove
            this.src = "http://localhost:2368/content/images/2017/06/gateau-pizza-alimentation-insolite.jpg";
            this.idx = idx;

            var $galleryItem = $('<li class="gallery-item">');
            $galleryItem.css("width", getGalleryItemWidth(columnDivider) + "%")
            $galleryItem.append([
                '<a href="' + this.src + '">',
                '<img src="' + this.src + '"/>',
                '</a>'
            ].join(''));

            $gallery.append($galleryItem);
        });

        $gallery.magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true,
                preload: [0, 2], // read about this option in next Lazy-loading section
                navigateByImgClick: true,
                arrowMarkup: '', // markup of an arrow button
                tPrev: 'Previous (Left arrow key)',
                tNext: 'Next (Right arrow key)',
                tCounter: '<span class="mfp-counter">%curr% / %total%</span>' // markup of counter
            }
        });

        $gallery.imagesLoaded(function () {
            $gallery.isotope({
                itemSelector: '.gallery-item',
                percentPosition: true,
                masonry: {
                    // set to the element
                    columnWidth: '.gallery-sizer'
                }
            });
        });
    }
}
