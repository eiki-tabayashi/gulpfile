'use strict';
var Params = require('gulp.plus-parameter');

module.exports = function($g, tasks,argv) {
  var $p = new Params();
  var $r = new Params({
    src:  'cmps/' + argv.component + '/docs/src',
    dest: 'docs/src',
    root: 'docs/src',
  });
  var _p = $p.data;
  var _r = $r.data;
  var data;

  // ---------------------------------------------------------------------------
  // [Tasks] CSS
  // ---------------------------------------------------------------------------

  /** css:clone */
  $p.set('src.globs',   _r.src  + '/htc/**/*')
    .set('dest.folder', _r.root + '/htc');
  $r.set('css.clone',   _p.src.globs);
  $g.task('css:clone',  tasks.clone($p.dump()));

  // ---------------------------------------------------------------------------
  // [Tasks] JavaScript
  // ---------------------------------------------------------------------------

  /** js:clone */
  $p.set('src.globs',   _r.src  + '/scripts/vendors/**/*')
    .set('dest.folder', _r.dest + '/scripts/vendors');
  $r.set('js.clone',    _p.src.globs);
  $g.task('js:clone',   tasks.clone($p.dump()));

  // ---------------------------------------------------------------------------
  // [Tasks] Fonts
  // ---------------------------------------------------------------------------

  /** fonts:clone */
  $p.set('src.globs',    _r.src  + '/fonts/**/*')
    .set('dest.folder',  _r.dest + '/fonts');
  $r.set('fonts.clone',  _p.src.globs);
  $g.task('fonts:clone', tasks.clone($p.dump()));

  // ---------------------------------------------------------------------------
  // [Tasks] Media
  // ---------------------------------------------------------------------------

  /** media:clone */
  $p.set('src.globs',    _r.src  + '/media/**/*')
    .set('dest.folder',  _r.dest + '/media');
  $r.set('media.clone',  _p.src.globs);
  $g.task('media:clone', tasks.clone($p.dump()));

  // ---------------------------------------------------------------------------
  // [Tasks] Sprites
  // ---------------------------------------------------------------------------

  /** sprites:clone */
  $p.set('src.globs',      _r.src  + '/sprites/**/*.png')
    .set('dest.folder',    _r.dest + '/sprites');
  $r.set('sprites.clone',  _p.src.globs);
  $g.task('sprites:clone', tasks.clone($p.dump()));

  // ---------------------------------------------------------------------------
  // [Tasks] Icons
  // ---------------------------------------------------------------------------

  /** icons:clone */
  $p.set('src.globs',    _r.src  + '/icons/**/*')
    .set('dest.folder',  _r.dest + '/icons');
  $r.set('icons.clone',  _p.src.globs);
  $g.task('icons:clone', tasks.clone($p.dump()));

  // ---------------------------------------------------------------------------
  // [Task] Deploy
  // ---------------------------------------------------------------------------

  $g.task('deploy', [
    'css:clone',
    'js:clone',
    'fonts:clone',
    'media:clone',
    'sprites:clone',
    'icons:clone',
  ]);

  // ---------------------------------------------------------------------------
  // [Task] Default
  // ---------------------------------------------------------------------------

  /** default */
  $g.task('default', ['deploy']);
};
