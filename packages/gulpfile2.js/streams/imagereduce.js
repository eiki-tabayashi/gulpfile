'use strict';
var imagemagick = require('gulp-gm');

module.exports = function() {
  return {
    get: function() {
      return function(options) {
        options = options || {};
        options.width  = 'undefined' !== typeof options.width  ?
                                                options.width  :
                                                0.5;
        options.height = 'undefined' !== typeof options.height ?
                                                options.height :
                                                0.5;
        return imagemagick(function(file, callback) {
          file.size(function(error, size) {
            callback(null, file.resize(
              size.width * options.width,
              size.height * options.height
            ));
          });
        });
      };
    },
  };
};
