// Generated by CoffeeScript 1.12.4
(function() {
  var CmapTable, DFont, Data, Directory, GlyfTable, HeadTable, HheaTable, HmtxTable, LocaTable, MaxpTable, NameTable, OS2Table, PostTable, TTFFont, fs;

  fs = require('fs');

  Data = require('../data');

  DFont = require('./dfont');

  Directory = require('./directory');

  NameTable = require('./tables/name');

  HeadTable = require('./tables/head');

  CmapTable = require('./tables/cmap');

  HmtxTable = require('./tables/hmtx');

  HheaTable = require('./tables/hhea');

  MaxpTable = require('./tables/maxp');

  PostTable = require('./tables/post');

  OS2Table = require('./tables/os2');

  LocaTable = require('./tables/loca');

  GlyfTable = require('./tables/glyf');

  TTFFont = (function() {
    TTFFont.open = function(filename, name) {
      var contents;
      contents = fs.readFileSync(filename);
      return new TTFFont(contents, name);
    };

    TTFFont.fromDFont = function(filename, family) {
      var dfont;
      dfont = DFont.open(filename);
      return new TTFFont(dfont.getNamedFont(family));
    };

    function TTFFont(rawData1, name) {
      var data, i, j, k, len, numFonts, offset, offsets, ref, version;
      this.rawData = rawData1;
      data = this.contents = new Data(rawData);
      if (data.readString(4) === 'ttcf') {
        if (!name) {
          throw new Error("Must specify a font name for TTC files.");
        }
        version = data.readInt();
        numFonts = data.readInt();
        offsets = [];
        for (i = j = 0, ref = numFonts; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          offsets[i] = data.readInt();
        }
        for (i = k = 0, len = offsets.length; k < len; i = ++k) {
          offset = offsets[i];
          data.pos = offset;
          this.parse();
          if (this.name.postscriptName === name) {
            return;
          }
        }
        throw new Error("Font " + name + " not found in TTC file.");
      } else {
        data.pos = 0;
        this.parse();
      }
    }

    TTFFont.prototype.parse = function() {
      this.directory = new Directory(this.contents);
      this.head = new HeadTable(this);
      this.name = new NameTable(this);
      this.cmap = new CmapTable(this);
      this.hhea = new HheaTable(this);
      this.maxp = new MaxpTable(this);
      this.hmtx = new HmtxTable(this);
      this.post = new PostTable(this);
      this.os2 = new OS2Table(this);
      this.loca = new LocaTable(this);
      this.glyf = new GlyfTable(this);
      this.ascender = (this.os2.exists && this.os2.ascender) || this.hhea.ascender;
      this.decender = (this.os2.exists && this.os2.decender) || this.hhea.decender;
      this.lineGap = (this.os2.exists && this.os2.lineGap) || this.hhea.lineGap;
      return this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
    };

    return TTFFont;

  })();

  module.exports = TTFFont;

}).call(this);
