'use strict';
var Params = require('gulp.plus-parameter');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);
      params.ace('server.options', { port: 8080, livereload: true });
      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.server(params.get('server.options')));
    };
  };
};
