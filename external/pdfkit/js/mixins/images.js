// Generated by CoffeeScript 1.12.4
(function() {
  var PDFImage,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  PDFImage = require('../image');

  module.exports = {
    initImages: function() {
      this._imageRegistry = {};
      return this._imageCount = 0;
    },
    image: function(src, x, y, options) {
      var bh, bp, bw, h, hp, image, ip, label, pages, ref, ref1, ref2, ref3, ref4, w, wp;
      if (options == null) {
        options = {};
      }
      if (typeof x === 'object') {
        options = x;
        x = null;
      }
      x = (ref = x != null ? x : options.x) != null ? ref : this.x;
      y = (ref1 = y != null ? y : options.y) != null ? ref1 : this.y;
      if (this._imageRegistry[src]) {
        ref2 = this._imageRegistry[src], image = ref2[0], label = ref2[1], pages = ref2[2];
        if (ref3 = this.page, indexOf.call(pages, ref3) < 0) {
          pages.push(this.page);
        }
      } else {
        image = PDFImage.open(src);
        label = "I" + (++this._imageCount);
        this._imageRegistry[src] = [image, label, [this.page]];
      }
      w = options.width || image.width;
      h = options.height || image.height;
      if (options.width && !options.height) {
        wp = w / image.width;
        w = image.width * wp;
        h = image.height * wp;
      } else if (options.height && !options.width) {
        hp = h / image.height;
        w = image.width * hp;
        h = image.height * hp;
      } else if (options.scale) {
        w = image.width * options.scale;
        h = image.height * options.scale;
      } else if (options.fit) {
        ref4 = options.fit, bw = ref4[0], bh = ref4[1];
        bp = bw / bh;
        ip = image.width / image.height;
        if (ip > bp) {
          w = bw;
          h = bw / ip;
        } else {
          h = bh;
          w = bh * ip;
        }
      }
      if (this.y === y) {
        this.y += h;
      }
      this.save();
      this.transform(w, 0, 0, -h, x, y + h);
      this.addContent("/" + label + " Do");
      this.restore();
      return this;
    },
    embedImages: function(fn) {
      var images, item, proceed, src;
      images = (function() {
        var ref, results;
        ref = this._imageRegistry;
        results = [];
        for (src in ref) {
          item = ref[src];
          results.push(item);
        }
        return results;
      }).call(this);
      return (proceed = (function(_this) {
        return function() {
          var image, label, pages, ref;
          if (images.length) {
            ref = images.shift(), image = ref[0], label = ref[1], pages = ref[2];
            return image.object(_this, function(obj) {
              var base, i, len, page;
              for (i = 0, len = pages.length; i < len; i++) {
                page = pages[i];
                if ((base = page.xobjects)[label] == null) {
                  base[label] = obj;
                }
              }
              return proceed();
            });
          } else {
            return fn();
          }
        };
      })(this))();
    }
  };

}).call(this);
