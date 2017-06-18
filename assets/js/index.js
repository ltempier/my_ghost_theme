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

        if (_GALLERY) {

            var $gallery = $('#gallery');
            $.each(_GALLERY, function () {

                var html = [
                    '<li class="gallery-item">',
                    '<a href="' + this.src + '">',
                    '<img src="' + this.src + '"/>',
                    '</a>',
                    '</li>'
                ].join('');

                var $item = $(html);

                $item.magnificPopup({
                    delegate: 'a',
                    type: 'image'
                });

                $gallery.append($item);
            });


            $gallery.imagesLoaded(function () {
                $gallery.isotope({
                    itemSelector: '.gallery-item'
                });


            });

        }

    });

})(jQuery);
