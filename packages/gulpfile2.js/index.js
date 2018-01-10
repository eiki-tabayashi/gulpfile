'use strict';
var runner  = require('gulp');
var Router  = require('gulp.plus-router');
var Loader  = require('gulp.plus-loader');

var router  = new Router();
var streams = new Loader('gulpfile.js/streams', [runner]);
var tasks   = new Loader('gulpfile.js/tasks',   [streams, runner]);
var should  = Router.should;

// -----------------------------------------------------------------------------
// [Router] Setup options
// -----------------------------------------------------------------------------

router
  .option('m', {
    alias: 'mode',
    type: 'string',
    default: process.env.NODE_ENV || 'development',
    choice: ['development', 'production'],
  })
  .option('c', {
    alias: 'component',
    type: 'string',
    default: '',
  });

// -----------------------------------------------------------------------------
// [Router ] Setup routes
// -----------------------------------------------------------------------------

router
  .route({
    m: 'development',
    c: '',
  }, require('./routes/docs/development.js'))
  .route({
    m: 'production',
    c: '',
  }, require('./routes/docs/production.js'))
  .route({
    m: 'development',
    c: should.notBeEqualsTo(''),
  }, require('./routes/cmps/development.js'))
  .route({
    m: 'production',
    c: should.notBeEqualsTo(''),
  }, require('./routes/cmps/development.js'));

// -----------------------------------------------------------------------------
// [Router] Run
// -----------------------------------------------------------------------------

router.run(runner, tasks);
