'use strict';
var Params   = require('gulp.plus-parameter');
var sequence = require('run-sequence');

module.exports = function($g, tasks, argv) {
  var $p = new Params();
  var $r = new Params({
    inc:  'inc',
    src:  'cmps/' + argv.component + '/docs/src',
    dest: 'cmps/' + argv.component + '/docs/test',
    root: 'cmps/' + argv.component + '/docs/test',
  });
  var _p = $p.data;
  var _r = $r.data;
  var data;

  // ---------------------------------------------------------------------------
  // [Tasks] HTML
  // ---------------------------------------------------------------------------

  /** html:build */
  $p.set('src.globs',   _r.src + '/*.pug')
    .set('dest.folder', _r.dest);
  $r.set('html.build',  _p.src.globs);
  $g.task('html:build', tasks.pug($p.dump()));

  // ---------------------------------------------------------------------------
  // [Tasks] CSS
  // ---------------------------------------------------------------------------

  /** css:clone */
  $p.set('src.globs',   _r.src  + '/htc/**/*')
    .set('dest.folder', _r.root + '/htc');
  $r.set('css.clone',   _p.src.globs);
  $g.task('css:clone',  tasks.clone($p.dump()));

  /** css:build */
  $p.set('src.globs',   _r.src  + '/styles/*.styl')
    .set('dest.folder', _r.dest + '/styles');
  $r.set('css.build',   _p.src.globs);
  $g.task('css:build',  tasks.stylus($p.dump()));

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

  /** media:build */
  $p.set('src.globs',   _r.src  + '/media/**/*')
    .set('dest.folder', _r.dest + '/media');
  $r.set('media.build', _p.src.globs);
  data = $p.dump();
  $g.task('media:retina:build', tasks.imageretina(data));
  $g.task('media:reduce:build', tasks.imagereduce(data));
  $g.task('media:build', function(done) {
    sequence('media:retina:build', 'media:reduce:build', done);
  });

  // ---------------------------------------------------------------------------
  // [Tasks] Sprites
  // ---------------------------------------------------------------------------

  /** sprites:build */
  $p.set('src.globs',        _r.src  + '/sprites/**/*.png')
    .set('dest.folder',      _r.dest + '/media')
    .set('json.dest.folder', _r.src  + '/styles/sprites')
  $r.set('sprites.build',    _p.src.globs);
  data = $p.dump();
  $g.task('sprites:retina:build', tasks.spriteretina(data));
  $g.task('sprites:reduce:build', tasks.spritereduce(data));
  $g.task('sprites:build', function(done) {
    sequence('sprites:retina:build', 'sprites:reduce:build', done);
  });

  // ---------------------------------------------------------------------------
  // [Tasks] Icons
  // ---------------------------------------------------------------------------

  /** icons:build */
  $p.set('src.globs',        _r.src  + '/icons/**/*')
    .set('dest.folder',      _r.dest + '/fonts')
    .set('css.src.globs',    _r.inc  + '/stylus/iconfont.styl')
    .set('css.dest.folder',  _r.src  + '/styles/icons');
  $r.set('icons.build.icon', _p.src.globs)
    .set('icons.build.css',  _p.css.src.globs);
  $g.task('icons:build',     tasks.iconfont($p.dump()));

  // ---------------------------------------------------------------------------
  // [Task] Server
  // ---------------------------------------------------------------------------

  /** server */
  $p.set('src.globs', _r.root);
  $g.task('server', tasks.server($p.dump()));

  // ---------------------------------------------------------------------------
  // [Task] Watch
  // ---------------------------------------------------------------------------

  /** watch */
  $g.task('watch', function() {
    $g.watch(_r.sprites.build,    ['sprites:build']);
    $g.watch(_r.icons.build.icon, ['icons:main:build']);
    $g.watch(_r.icons.build.css,  ['icons:main:build']);
    $g.watch(_r.media.build,      ['media:build']);
    $g.watch(_r.fonts.clone,      ['fonts:clone']);
    $g.watch(_r.js.clone,         ['js:clone']);
    $g.watch(_r.css.clone,        ['css:clone']);
    $g.watch(_r.css.build,        ['css:build']);
    $g.watch(_r.html.build,       ['html:build']);
  });

  // ---------------------------------------------------------------------------
  // [Task] Deploy
  // ---------------------------------------------------------------------------

  /** deploy */
  $g.task('deploy', function(done) {
    sequence([
      'icons:build',
      'sprites:build',
      'media:build',
      'fonts:clone',
      'js:clone',
      'css:clone',
    ], [
//    'js:modernizr:build',
//    'js:main:build',
      'html:build',
      'css:build',
    ], 'server', 'watch', done);
  });

  // ---------------------------------------------------------------------------
  // [Task] Default
  // ---------------------------------------------------------------------------

  /** default */
  $g.task('default', ['server', 'watch']);
};
