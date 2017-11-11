"use strict";


class MyGallery {

    constructor(selector, options, listItem) {

        options = options || {};

        this.columns = options.columns || 3;
        this.maxItemWidth = options.maxItemWidth || Math.ceil(this.columns / 2);
        this.firstItemWidth = options.firstItemWidth || Math.floor(this.columns / 2);
        this.resizeRatio = options.resizeRatio || (25 / 100);

        this.onItemRender = options.onItemRender;
        this.onGalleryRender = options.onGalleryRender;

        this.$gallery = $(selector);
        this.$gallery.empty();
        this.$gallery.addClass('my-gallery-lib');

        if (listItem)
            this.setListItemByBatch(listItem, 10);

        window.onresize = () => {
            this.init();
            this.process()
        };
    }

    init() {
        var galleryWidthPixel = this.$gallery.width();
        if (this._galleryWidthPixel == galleryWidthPixel)
            return;

        this._galleryWidthPixel = galleryWidthPixel;
        this._galleryHeightPixel = 0;
        this._columnWidthPixel = galleryWidthPixel / this.columns;

        this._columnIdx = 0;
        this._itemIdx = 0;
        this._bufferColumnsHeight = [];
        for (var i = 0; i < this.columns; i++)
            this._bufferColumnsHeight[i] = 0

        this._bufferItemWidthByColumn = {};
    }

    setListItem(listItem) {
        this.setListItemByBatch(listItem, listItem.length)
    }

    setListItemByBatch(listItem, batch) {
        this._listItem = [];
        this.init();

        var itemIdx = 0;
        var self = this;
        var buffer = 0;

        setListItem();

        function setListItem() {
            var length = batch;
            if (buffer + length >= listItem.length)
                length = (listItem.length - 1) - buffer;


            var j = 0;
            for (var i = 0; i < length; i++) {
                var item = listItem[buffer + i];

                self.getImageSize(item, function (err, item) {

                    if (err)
                        console.log(err);
                    else {
                        if (item.idx == null)
                            item.idx = itemIdx;
                        itemIdx++;

                        //console.log('getImageSize', item.idx);

                        self._listItem.push(item);
                        self._listItem = self._listItem.sort(function (a, b) {
                            return a.idx - b.idx
                        });
                        self.process();
                    }

                    buffer++;
                    j++;
                    if (j >= length)
                        setListItem()
                });
            }
        }
    }

    process() {

        for (var itemIdx = this._itemIdx; itemIdx < this._listItem.length; itemIdx++) {
            var originItem = this._listItem.find(function (item) {
                return item.idx == itemIdx
            });

            if (originItem) {
                //console.log('process', itemIdx);
                var item = JSON.parse(JSON.stringify({
                    src: originItem.src,
                    alt: originItem.alt,
                    idx: originItem.idx
                }));

                var itemColumnWidth = 1;
                var currentColumnHeight = this._bufferColumnsHeight[this._columnIdx];
                var maxItemColumnWidth = Math.floor(originItem.width / this._columnWidthPixel);

                for (var i = (this._columnIdx + 1); i < this.columns; i++) {
                    if (itemColumnWidth >= maxItemColumnWidth) //for best img quality
                        break;
                    if (this.maxItemWidth && itemColumnWidth >= this.maxItemWidth)
                        break;
                    if (currentColumnHeight === this._bufferColumnsHeight[i]) //currentHeight === rightColumnHeight
                        itemColumnWidth += 1;
                    else
                        break
                }

                if (itemIdx == 0)
                    itemColumnWidth = this.getItemWidth(this.firstItemWidth);
                else
                    itemColumnWidth = this.getItemWidth(itemColumnWidth);

                var widthPx = itemColumnWidth * this._columnWidthPixel;

                item.height = Math.round(originItem.height * (widthPx / originItem.width));
                item.width = widthPx;
                item.left = this._columnIdx * this._columnWidthPixel;
                item.top = this._bufferColumnsHeight[this._columnIdx];
                item.resized = false;

                //try resize item -> same height then left column
                var leftColumnHeight = (this._columnIdx > 0) ? this._bufferColumnsHeight[this._columnIdx - 1] : null;
                if (leftColumnHeight) {
                    var deltaHeight = Math.abs(leftColumnHeight - currentColumnHeight);
                    var ratio = deltaHeight / item.height;

                    if (ratio != 1 && Math.abs(1 - ratio) < this.resizeRatio) {
                        item.height = deltaHeight;
                        item.resized = true;
                    }
                }

                for (var i = 0; i < itemColumnWidth; i++)
                    this._bufferColumnsHeight[this._columnIdx + i] += item.height;

                //find best _columnIdx
                var minColumnHeight = this._bufferColumnsHeight[this._columnIdx];
                for (var i = (this.columns - 1); i >= 0; i--) {
                    if (this._bufferColumnsHeight[i] <= minColumnHeight) {
                        minColumnHeight = this._bufferColumnsHeight[i];
                        this._columnIdx = i
                    }
                }

                this._galleryHeightPixel = this._bufferColumnsHeight[0];
                for (var i = 0; i < this.columns; i++) {
                    if (this._bufferColumnsHeight[i] > this._galleryHeightPixel)
                        this._galleryHeightPixel = this._bufferColumnsHeight[i];
                }
                this.renderItem(item)
            } else
                break
        }
        this._itemIdx = itemIdx;
    }

    getImageSize(item, callback) {
        if (item.width != null && item.height != null)
            return callback(null, item);

        var img = document.createElement('img');

        //var poll = setInterval(function () {
        //    if (img.naturalWidth) {
        //        clearInterval(poll);
        //        item.width = img.naturalWidth;
        //        item.height = img.naturalHeight;
        //        callback(null, item);
        //
        //        img.src = "";
        //        img.onload = null;
        //        img.onerror = null;
        //    }
        //}, 50);

        img.onload = function () {
            //clearInterval(poll);
            item.width = this.width;
            item.height = this.height;
            callback(null, item)
        };

        img.onerror = function (e) {
            //clearInterval(poll);
            callback(new Error("Image URL '" + this.src + "' is invalid."))
        };

        img.src = item.src;
    }

    getItemWidth(max) {
        var min = 1;
        var width = min;

        if (!max || max > this.maxItemWidth)
            max = this.maxItemWidth;

        if (max > 1) {
            var itemUpWidth = this._bufferItemWidthByColumn[this._columnIdx];
            for (var w = max; w > min; w--) {
                if (w != itemUpWidth) {
                    width = w;
                    break
                }
            }
        }

        this._bufferItemWidthByColumn[this._columnIdx] = width;
        for (var i = 1; i < width; i++)
            this._bufferItemWidthByColumn[this._columnIdx + 1] = null;

        return width;
    }


    renderItem(item) {

        //console.log('render', item.idx);
        var $galleryItem;

        function setGalleryItemCss() {
            $galleryItem.css('position', 'absolute');
            $galleryItem.css('width', item.width + 'px');
            $galleryItem.css('height', item.height + 'px');
            $galleryItem.css('top', item.top + 'px');
            $galleryItem.css('left', item.left + 'px');
        }

        $galleryItem = $('.gallery-item[data-gallery-item-idx=' + item.idx + ']');
        if ($galleryItem.length)
            setGalleryItemCss();
        else {
            $galleryItem = $('<li class="gallery-item" data-gallery-item-idx="' + item.idx + '">');
            if (item.resized)
                $galleryItem.addClass('resized');
            setGalleryItemCss();
            $galleryItem.append([
                //'<a href="' + item.src + '">',
                '<img src="' + item.src + '" alt="' + item.alt + '"/>',
                //'</a>'
            ].join(''));
            this.$gallery.append($galleryItem);
        }
        this.$gallery.css('height', this._galleryHeightPixel + 'px');

        if (this.onItemRender && $.isFunction(this.onItemRender))
            this.onItemRender($galleryItem);
        if (this._itemIdx == (this._listItem.length - 1) && $.isFunction(this.onGalleryRender))
            this.onGalleryRender(this.$gallery);
    }
}
