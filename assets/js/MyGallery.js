"use strict";


class MyGallery {

    constructor(selector, listItem, options) {

        options = options || {};

        this.columns = options.columns || 3;
        this.maxItemWidth = options.maxItemWidth;
        this.firstItemWidth = options.firstItemWidth || Math.floor(this.columns / 2);
        this.resizeRatio = options.resizeRatio || (25 / 100);
        this.onRender = options.onRender;


        if (this.maxItemWidth && this.firstItemWidth > this.maxItemWidth)
            this.firstItemWidth = this.maxItemWidth;

        this.$gallery = $(selector);

        this.$gallery.empty();
        this.$gallery.addClass('my-gallery-lib');

        this.galleryWidthPixel = 0;
        this.galleryHeightPixel = 0;

        this.setListItem(listItem);
    }

    setListItem(listItem) {
        this._listItem = [];
        var self = this;
        (listItem || []).forEach(function (item, idx) {
            var img = new Image();
            img.onload = function () {

                self._listItem.push({
                    src: this.src,
                    idx: this.idx,
                    alt: this.alt,
                    height: this.height,
                    width: this.width
                });

                if (self._listItem.length == listItem.length) {
                    self._listItem = self._listItem.sort(function (a, b) {
                        return a.idx - b.idx
                    });

                    self.refresh();
                    window.onresize = function () {
                        self.refresh();
                    };
                }
            };
            img.src = item.src;
            img.idx = idx;
            img.alt = item.alt;
        });
    }

    getItemWidth(max) {
        if (!this._bufferRandomItemWidth)
            this._bufferRandomItemWidth = {};

        var min = 1;
        var width = min;

        if (!max || max > Math.ceil(this.columns / 2))
            max = Math.ceil(this.columns / 2);

        if (max > 1) {
            var itemUpWidth = this._bufferRandomItemWidth[this._columnIdx];
            for (var w = max; w > min; w--) {
                if (w != itemUpWidth) {
                    width = w;
                    break
                }
            }
        }

        this._bufferRandomItemWidth[this._columnIdx] = width;
        return width;
    }

    refresh() {

        var galleryWidthPixel = this.$gallery.width();
        if (this.galleryWidthPixel == galleryWidthPixel)
            return;

        this.galleryWidthPixel = galleryWidthPixel;
        this.galleryHeightPixel = 0;

        var listItem = [];
        var columnWidthPixel = galleryWidthPixel / this.columns;

        // init bufferColumnsHeight
        var bufferColumnsHeight = [];
        for (var i = 0; i < this.columns; i++)
            bufferColumnsHeight[i] = 0

        this._columnIdx = 0;
        this._listItem.forEach((originItem, itemIdx) => {
            var item = JSON.parse(JSON.stringify({
                src: originItem.src,
                alt: originItem.alt,
                idx: originItem.idx
            }));

            var itemColumnWidth = 1;

            var currentColumnHeight = bufferColumnsHeight[this._columnIdx];
            var maxItemColumnWidth = Math.floor(originItem.width / columnWidthPixel);
            for (var i = (this._columnIdx + 1); i < this.columns; i++) {
                if (itemColumnWidth >= maxItemColumnWidth) //for best img quality
                    break;
                if (this.maxItemWidth && itemColumnWidth >= this.maxItemWidth)
                    break;
                if (currentColumnHeight === bufferColumnsHeight[i]) //currentHeight === rightColumnHeight
                    itemColumnWidth += 1;
                else
                    break
            }

            if (itemIdx == 0)
                itemColumnWidth = this.firstItemWidth;
            else
                itemColumnWidth = this.getItemWidth(itemColumnWidth);

            var widthPx = itemColumnWidth * columnWidthPixel;

            item.height = Math.round(originItem.height * (widthPx / originItem.width));
            item.width = widthPx;
            item.left = this._columnIdx * columnWidthPixel;
            item.top = bufferColumnsHeight[this._columnIdx];
            item.resized = false;

            //try resize item -> same height then left column
            var leftColumnHeight = (this._columnIdx > 0) ? bufferColumnsHeight[this._columnIdx - 1] : null;
            if (leftColumnHeight) {
                var deltaHeight = Math.abs(leftColumnHeight - currentColumnHeight);
                var ratio = deltaHeight / item.height;

                if (ratio != 1 && Math.abs(1 - ratio) < this.resizeRatio) {
                    item.height = deltaHeight;
                    item.resized = true;
                }
            }

            for (var i = 0; i < itemColumnWidth; i++)
                bufferColumnsHeight[this._columnIdx + i] += item.height;

            //find best _columnIdx
            this._columnIdx = 0;
            var minColumnHeight = bufferColumnsHeight[this._columnIdx];
            for (var i = (this.columns - 1); i > 0; i--) {
                if (bufferColumnsHeight[i] <= minColumnHeight) {
                    minColumnHeight = bufferColumnsHeight[i];
                    this._columnIdx = i
                }
            }

            listItem.push(item);
        });


        this.galleryHeightPixel = bufferColumnsHeight[0];
        for (var i = 0; i < this.columns; i++) {
            if (bufferColumnsHeight[i] > this.galleryHeightPixel)
                this.galleryHeightPixel = bufferColumnsHeight[i];
        }


        this.render(listItem);
    }

    render(listItem, clear) {

        function setGalleryItemCss($galleryItem, item) {
            $galleryItem.css('position', 'absolute');
            $galleryItem.css('width', item.width + 'px');
            $galleryItem.css('height', item.height + 'px');
            $galleryItem.css('top', item.top + 'px');
            $galleryItem.css('left', item.left + 'px');
        }

        if (clear === true)
            this.$gallery.empty();//TODO remove line

        if ($(".gallery-item").length)
            listItem.forEach((item) => {
                var $galleryItem = $('.gallery-item[data-gallery-item-idx=' + item.idx + ']');
                setGalleryItemCss($galleryItem, item)
            });
        else {
            listItem.forEach((item) => {
                var $galleryItem = $('<li class="gallery-item" data-gallery-item-idx="' + item.idx + '">');

                if (item.resized)
                    $galleryItem.addClass('resized');

                setGalleryItemCss($galleryItem, item);

                $galleryItem.append([
                    '<a href="' + item.src + '">',
                    '<img src="' + item.src + '" alt="' + item.alt + '"/>',
                    '</a>'
                ].join(''));

                this.$gallery.append($galleryItem);
            });
            if (this.onRender)
                this.onRender()
        }

        this.$gallery.css('height', this.galleryHeightPixel + 'px');
    }
}
