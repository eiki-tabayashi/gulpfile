'use strict';
var kindof  = require('kind-of');
var through = require('through2');
var gutil   = require('gulp-util');
var path    = require('path');
var Q       = require('q');

module.exports = function() {
  return {
    get: function() {
      return function(options) {
        var groups = {};
        options = options || {};

        if ('function' === kindof(options)) {
          options = {aggregate: options};
        }

        if (!('group' in options) || !options.group) {
          options.group = function(file) {
            return path.basename(path.dirname(file.path));
          };
        }

        if (!('aggregate' in options) || !options.aggregate) {
          options.aggregate = function() {};
        }

        return through.obj(
          function(file, encoding, callback) {
            var group;

            if (file.isNull()) {
              return callback(null, file);
            }

            if (file.isStream()) {
              return callback(new gutil.PluginError(
                'gulp.aggregate',
                'Streaming not supported'
              ));
            }

            group = options.group(file);
            if (!(group in groups)) {
              groups[group] = [];
            }
            groups[group].push(file);
            return callback();
          },
          function(callback) {
            var $this, promises;
            $this = this;
            promises = [];
            Object.keys(groups).forEach(function(group) {
              var files = options.aggregate(group, groups[group], Q.defer());
              if (Q.isPromise(files)) {
                promises.push(files);
              } else {
                files = Array.isArray(files) ? files : [files];
                files.forEach(function(file) {
                  file = isPlainObject(file) ? new gutil.File(file) : file;
                  if (file instanceof gutil.File) {
                    $this.push(file);
                  }
                });
              }
            });
            return promises.length ?
              Q.when.apply(Q, promises).then(callback).done() :
              callback();
          }
        );
      };
    },
  };
};
