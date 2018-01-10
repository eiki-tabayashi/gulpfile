'use strict';
var Params = require('gulp.plus-parameter');
var path   = require('path');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);

//    var stylus  = require('stylus');
      var numcode = require('stylus-numcode');
//    var paths   = [
//      path.resolve(path.join(src, 'components')),
//      path.resolve(cfg.media.retina.build.dest),
//    ];
//
      params.default('stylus.options', {
        define: {
          fontsURL: '../fonts',
//        dataURL: stylus.url({paths: paths}),
          numcode: numcode,
        },
//      paths: paths,
        compress: false,
        'include css': true,
     });
      params.default('autoprefixer.options', ['last 2 versions']);
      params.default('beautify.options', {
        indent_size: 2,
        indent_char: ' ',
        end_with_newline: true,
      });

      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.plumber(params.get('plumber.options')))
        .pipe(streams.stylus(params.get('stylus.options')))
        .pipe(streams.replace(RegExp('(progid:)\s+', 'g'), '$1'))
        .pipe(streams.cmq(params.get('cmq.options')))
        .pipe(streams.autoprefixer(params.get('autoprefixer.options')))
        .pipe(streams.csso(params.get('csso.options')))
        .pipe(streams.beautify(params.get('beautify.options')))
        .pipe(streams.dest(
          params.get('dest.folder'),
          params.get('dest.options')
        ));
    };
  };
};
