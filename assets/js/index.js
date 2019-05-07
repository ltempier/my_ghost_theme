"use strict";


$(document).ready(function () {


    // try { //A lightweight, easy-to-use jQuery plugin for fluid width video embeds.
    // var $postContent = $(".post-content");
    // $postContent.fitVids();
    // } catch (e) {
    // }

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

    try {
        imagePopupProcess()
    } catch (e) {

    }
});


//function imgurProcess() {
//    $('img').each(function () {
//        var $imgur = $("<div class='imgur-img-process'></div>");
//        var imgClass = $(this).attr('class');
//
//        $imgur.attr('class', imgClass);
//        $(this).attr('class', '');
//        $imgur.css('background', 'url("' + getImgurLight(this.src) + '") center center no-repeat');
//        $(this).wrap($imgur);
//
//    })
//}

// function isImgurUrl(src) {
//     var srcRegex = new RegExp('imgur\.com/(.*)\.jpg', 'g');
//     return srcRegex.test(src)
// }

// function getImgurLight(src) {
//     if (isImgurUrl(src)) {
//         var light = src.split('/');
//         var id = light.pop().substring(0, 7);
//         light.push(id + 'h.jpg');
//         return light.join('/');
//     }
//     return src
// }
//
// function getImgurHight(src) {
//     if (isImgurUrl(src)) {
//         var hight = src.split('/');
//         var id = hight.pop().substring(0, 7);
//         hight.push(id + '.jpg');
//         return hight.join('/');
//     }
//     return src
// }

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
            $postTitle.addClass('fixed');
            $('.post-container').addClass('mt')
        }
        else {
            $postTitle.attr('class', 'post-title');
            $postTitle.removeClass('fixed');
            $('.post-container').removeClass('mt')
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

function galleryProcess() {

    if ($('.gallery-container').length) {

        $('.gallery-container').each(function () {

            var src = [];
            var $gallery = $(this);

            $gallery.find("img").each(function () {
                src.push({src: "" + $(this).attr("src")});
                $(this).attr("src", "")
            });

            $gallery.empty();

            var $loader = $('<div class="loader"/>');
            $loader.insertAfter($gallery);

            var gallery = new MyGallery($gallery, {
                columns: 3,
                firstItemWidth: 2,
                onItemRender: function () {
                    imagePopupProcess()
                },
                onGalleryRender: function () {
                    console.log('onGalleryRender');
                    $loader.remove()
                }

            });
            gallery.setListItemByBatch(src, 3)
        });
    }
}


var bufferImagePopupProcess = null;

function imagePopupProcess() {

    var modal = $('[data-remodal-id=modal]').remodal();
    var $content = $('.modal-content-gallery');

    if (bufferImagePopupProcess == null) {
        bufferImagePopupProcess = 0;
        $content.slick({
            lazyLoad: 'ondemand',
            infinite: true,
            adaptiveHeight: true,
            // variableWidth: true,
            // centerMode: true,

            prevArrow: '<button class="btn slick-arrow slick-prev"><i class="glyphicon glyphicon-triangle-left"></i></button>',
            nextArrow: '<button class="btn slick-arrow slick-next"><i class="glyphicon glyphicon-triangle-right"></i></button>'
        });
    }

    $('.post-container img').each(function (idx) {
        //var src = getImgurHight(this.src);
        var src = this.src;

        if (idx >= bufferImagePopupProcess) {
            $content.slick('slickAdd', '<img src="' + src + '"/>');

            $(this).css('cursor', 'zoom-in');
            $(this).unbind('click');
            $(this).on('click', function (e) {
                e.preventDefault();
                $content.slick('slickGoTo', idx);
                modal.open();
                $content.slick('refresh') //little hack
            });

            bufferImagePopupProcess++
        }
    });
}
