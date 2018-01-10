'use strict';

module.exports = function(streams, runner) {
  return function(watches) {
    return function() {
      watches.forEach(function(watch) {
        runner.watch.apply(runner, watch);
      });
    };
  };
};
