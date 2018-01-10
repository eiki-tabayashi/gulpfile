'use strict';
var path    = require('path');
var gutil   = require('gulp-util');
var through = require('through2');

module.exports = function() {
  return {
    get: function() {
      return function(options) {
        options = options || {};
        options.glue  = options.glue  || '--';
        options.state = options.state || 'default';

        var firstfile;
        var files = [];
        return through.obj(
          function(file, encoding, callback) {
            if (file.isNull()) {
              return callback(null, file);
            }

            if (file.isStream()) {
              return callback(new gutil.PluginError(
                'spritesheet',
                'Streaming not supported'
              ));
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
              Object.keys(json).forEach(function(name) {
                var values = json[name];
                var pixel  = values.px;
                var names  = name.split(options.glue);
                var state  = names.length > 1 ? names.pop()
                                              : options.state;
                name = names.join('');
                memo[name] = memo[name] || {};
                memo[name][state] = {
                  image:  values['escaped_image'],
                  width:  pixel['width'],
                  height: pixel['height'],
                  top:    pixel['offset_y'],
                  left:   pixel['offset_x'],
                };
              });
              return memo;
            }, {});

            this.push(new gutil.File({
              cwd:  firstfile.cwd,
              base: firstfile.base,
              path: path.join(firstfile.base, path.basename(firstfile.path)),
              contents: new Buffer(JSON.stringify(contents)),
            }));
            return callback();
          }
        );
      };
    },
  };
};
