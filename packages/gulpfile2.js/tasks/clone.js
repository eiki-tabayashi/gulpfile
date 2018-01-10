'use strict';
var Params = require('gulp.plus-parameter');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);

      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.dest(
          params.get('dest.folder'),
          params.get('dest.options')
        ));
    };
  };
};
