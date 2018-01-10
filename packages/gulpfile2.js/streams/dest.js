'use strict';

module.exports = function(runner) {
  return {
    get: function() {
      return runner.dest.bind(runner);
    },
  };
};
