'use strict';
var Params = require('gulp.plus-parameter');
var path   = require('path');
var join   = path.join;

/**
 * srcフォルダに@1x指定のない画像ファイルがある場合、
 * @2x画像として扱い、@2xを付与してdestフォルダに書き出す。
 */
module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);

      var filter2x = streams.filter([
        join('**', '*.*'),
        '!' + join('**', '*@1x.*')
      ]);
      var imagemin = require('gulp-imagemin');
      var pngquant = require('imagemin-pngquant');
      var mozjpeg  = require('imagemin-mozjpeg');

      params.default('rename.options', { suffix: '@2x' });
      params.default('imageminify.plugins', [
        pngquant({ speed: 1 }),
        mozjpeg(),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle(),
      ]);
      params.default('imageminify.options', { verbose: true });

      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(filter2x)
        .pipe(streams.rename(params.get('rename.options')))
        .pipe(streams.imageminify(
          params.get('imageminify.plugins'),
          params.get('imageminify.options')
        ))
        .pipe(streams.dest(
          params.get('dest.folder'),
          params.get('dest.options')
        ));
    };
  };
};
