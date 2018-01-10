'use strict';

module.exports = function() {
  return {
    get: function() {
      return function() {
        var gutil   = require('gulp-util');
        var through = require('through2');
        var merge   = require('merge');
        var firstfile;
        var files = [];

        return through.obj(
          function(file, encoding, callback) {
            if (file.isNull()) {
              return callback(null, file);
            }
            if (file.isStream()) {
              return callback(
                new gutil.PluginError(
                  'jsonmerge',
                  'Streaming not supported'
                )
              );
            }
            if (!firstfile) {
              firstfile = file;
            }
            files.push(file);
            return callback();
          },
          function(callback) {
            if (!files.length) {
              return callback();
            }
            var contents = files.reduce(function(memo, file) {
              var json = JSON.parse(file.contents.toString());
              return merge(memo, json || {});
            }, {});
            this.push(new gutil.File({
              cwd: firstfile.cwd,
              base: firstfile.base,
              path: path.join(
                firstfile.base,
                path.basename(firstfile.path)
              ),
              contents: new Buffer(JSON.stringify(contents)),
            }));
            return callback();
          }
       );
      };
    },
  };
};
