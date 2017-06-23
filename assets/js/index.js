/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {
        var $postContent = $(".post-content");
        $postContent.fitVids();

        try {
            galleryProcess()
        } catch (e) {

        }

        try {
            carouselProcess()
        } catch (e) {

        }

    });

})(jQuery);


function carouselProcess() {
    $('.carousel-gallery').each(function () {
        $(this).slick({
            autoplay: true,
            infinite: true,
            prevArrow: '<button class="btn slick-arrow slick-prev"><i class="glyphicon glyphicon-triangle-left"></i></button>',
            nextArrow: '<button class="btn slick-arrow slick-next"><i class="glyphicon glyphicon-triangle-right"></i></button>'
        });
    })
}


function galleryProcess() {

    if (_GALLERY && _GALLERY.length) {

        var $gallery = $('#gallery');

        $.each(_GALLERY, function () {
            var html = [
                '<li class="gallery-item">',
                '<a href="' + this.src + '">',
                '<img src="' + this.src + '"/>',
                '</a>',
                '</li>'
            ].join('');

            $gallery.append(html);
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
                itemSelector: '.gallery-item'
            });
        });
    }
}
