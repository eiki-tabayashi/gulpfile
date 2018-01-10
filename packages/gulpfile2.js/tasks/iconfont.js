'use strict';
var Params = require('gulp.plus-parameter');
var path     = require('path');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);

      var imagemin = require('gulp-imagemin');
      params.default('imageminify.plugins', [ imagemin.svgo() ]);
      params.default('imageminify.options', { verbose: true });
      params.default('iconfont.options', {
        normalize: true,
        fontHeight: 448,
        descent:     64,
        formats: ['ttf', 'eot', 'woff', 'svg'],
      });

      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.imageminify(
          params.get('imageminify.plugins'),
          params.get('imageminify.options')
        ))
        .pipe(streams.aggregate(function(group, files, deferred) {
          params.set('iconfont.options.fontName', group);
          streams
            .src(files.map(function(file) {
              return file.path;
            }))
            .pipe(streams.iconfont(params.get('iconfont.options')))
            .on('glyphs', function(glyphs,options) {
              streams
                .src(
                  params.get('css.src.globs'),
                  params.get('css.src.options')
                )
                .pipe(streams.template({
                  fontname: group,
                  fonturl: 'fontsURL',
                  glyphs: glyphs.map(function(glyph) {
                    return {
                      name: glyph.name,
                      codepoint: glyph.unicode[0]
                                      .charCodeAt(0).toString(16),
                    };
                  }),
                }))
                .pipe(streams.rename({basename: group}))
                .pipe(streams.dest(
                  params.get('css.dest.folder'),
                  params.get('css.dest.options')
                ))
                .on('end', function() {
                  deferred.resolve();
                });
            })
            .pipe(streams.dest(
              params.get('dest.folder'),
              params.get('dest.options')
            ));
          return deferred.promise;
        }));
    };
  };
};
