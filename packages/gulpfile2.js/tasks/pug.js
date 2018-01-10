'use strict';
var Params = require('gulp.plus-parameter');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);

      params.default('beautify.options', {
        indent_size: 2,
        indent_char: ' ',
        end_with_newline: true,
      });
      params.default('pug.options', { basedir: process.cwd() });

      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.plumber(params.get('plumber.options')))
        .pipe(streams.pug(params.get('pug.options')))
        .pipe(streams.beautify(params.get('beautify.options')))
        .pipe(streams.replace(RegExp('<!DOCTYPE html>'), '<!doctype html>'))
        .pipe(streams.replace(RegExp('(<!-->)\n(<html)', 'i'), '$1$2'))
        .pipe(streams.replace(RegExp('\n(<!--<!\[endif\]-->)', 'i'), '$1'))
        .pipe(streams.replace(RegExp('\n+', 'g'), '\n'))
        .pipe(streams.dest(
          params.get('dest.folder'),
          params.get('dest.options')
        ));
    };
  };
};
