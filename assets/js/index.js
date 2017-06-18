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
            $.each(_GALLERY, function (item) {

                var $item = $("<li class='gallery-item'></li>");
                $item.append($('<img src="' + this.src + '"/>'));
                //$item.append($('<span>' + this.legend + '</span>'));

                $gallery.append($item);
            });

            $gallery.imagesLoaded().done(function () {
                $gallery.isotope({
                    //percentPosition: true,
                    itemSelector: '.gallery-item',
                    //masonry: {
                    //    columnWidth: '.grid-sizer'
                    //}
                });
            });

        }

    });

})(jQuery);
