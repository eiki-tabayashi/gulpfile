'use strict';
var Params    = require('gulp.plus-parameter');
var workspace = require('workspace');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);

      var imagemin = require('gulp-imagemin');
      var pngquant = require('imagemin-pngquant');

      params.default('spritesmith.options', {
        algorithm: 'binary-tree',
        padding: 3,
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

      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.aggregate(function(group, files, deferred) {
          params.set('spritesmith.options.reduce.imgName', group +  '.png');
          params.set('spritesmith.options.reduce.cssName', group + '.json');
          var tmpdir = workspace();
          var sprite = streams
            .src(files.map(function(file) {
              return file.path;
            }))
            .pipe(streams.imagereduce(params.get('imagereduce.options')))
            .pipe(streams.dest(tmpdir.path))
            .pipe(streams.spritesmith(
              params.get('spritesmith.options.reduce')
            ));
          sprite.on('finish', function() {
            sprite.img
              .pipe(streams.buffer())
              .pipe(streams.imageminify(
                params.get('imageminify.plugins'),
                params.get('imageminify.options')
              ))
              .pipe(streams.dest(
                params.get('dest.folder'),
                params.get('dest.options')
              ))
              .on('end', function() {
                tmpdir.remove();
              });

            sprite.css
              .pipe(streams.spritesheet(params.get('spritesheet.options')))
              .pipe(streams.beautify(params.get('beautify.options')))
              .pipe(streams.dest(
                params.get('json.dest.folder'),
                params.get('json.dest.options')
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
