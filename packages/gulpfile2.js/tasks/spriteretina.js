'use strict';
var Params = require('gulp.plus-parameter');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);

      var imagemin = require('gulp-imagemin');
      var pngquant = require('imagemin-pngquant');

      params.default('spritesmith.options', {
        algorithm: 'binary-tree',
        padding: 6,
      });
      params.default('beautify.options', {
        indent_size: 2,
        indent_char: ' ',
        end_with_newline: true,
      })
      params.default('imageminify.plugins', [
        pngquant({ speed: 1 }),
        imagemin.optipng(),
      ])
      params.default('imageminify.options', { verbose: true });
      params.default('rename.options', {suffix: '@2x'});

      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.aggregate(function(group, files, deferred) {
          params.set('spritesmith.options.imgName', group +  '.png');
          params.set('spritesmith.options.cssName', group + '.json');
          var sprite = streams
            .src(files.map(function(file) {
              return file.path;
            }))
            .pipe(streams.spritesmith(
              params.get('spritesmith.options')
            ));
          sprite.on('finish', function() {
            sprite.img
              .pipe(streams.buffer())
              .pipe(streams.imageminify(
                params.get('imageminify.plugins'),
                params.get('imageminify.options')
              ))
              .pipe(streams.rename(params.get('rename.options')))
              .pipe(streams.dest(
                params.get('dest.folder'),
                params.get('dest.options')
              ))
              .on('end', function() {
                deferred.resolve();
              });
          });
          return deferred.promise;
        }));
    };
  };
};
