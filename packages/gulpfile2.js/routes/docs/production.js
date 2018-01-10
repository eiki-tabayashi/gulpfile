'use strict';
var Params   = require('gulp.plus-parameter');
var sequence = require('run-sequence');

module.exports = function($g, tasks) {
  var $p = new Params();
  var $r = new Params({
    inc:  'inc',
    src:  'docs/src',
    dest: 'docs/dest',
    root: 'docs/dest',
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

  /** css:build */
  $p.set('src.globs',   _r.src  + '/styles/*.styl')
    .set('dest.folder', _r.dest + '/styles');
  $r.set('css.build',   _p.src.globs);
  $g.task('css:build',  tasks.stylus($p.dump()));


  /** css:bless */
  $p.set('src.globs', [ _r.dest + '/styles/*.css',
                  '!' + _r.dest + '/styles/*.*.css' ])
    .set('dest.folder', _r.dest + '/styles');
  $r.set('css:bless',   _p.src.globs);
  $g.task('css:bless',  ['css:build'], tasks.bless($p.dump()));

  /** css:minify */
  $p.set('src.globs', [ _r.dest + '/styles/*.css',
                  '!' + _r.dest + '/styles/*.min.css' ])
    .set('dest.folder', _r.root + '/styles');
  $r.set('css:minify',  _p.src.globs);
  $g.task('css:minify', ['css:bless'], tasks.cssminify($p.dump()));

  /** css:gzip */
  $p.set('src.globs', [ _r.dest + '/styles/*.min.css',
                  '!' + _r.dest + '/styles/*.gz' ])
    .set('dest.folder', _r.root + '/styles');
  $g.task('css:gzip', ['css:minify'], tasks.gzip($p.dump()));

  /** css:nomq */
  $p.set('src.globs', [ _r.dest + '/styles/*.css',
                  '!' + _r.dest + '/styles/*.*.css' ])
    .set('dest.folder', _r.root + '/styles');
  $r.set('css:nomq', _p.src.globs);
  $g.task('css:nomq', ['css:build'], tasks.nomq($p.dump()));

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
  $p.set('src.globs', _r.root)
    .set('server.options.open', true);
  $g.task('server', tasks.server($p.dump()));

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
      'css:clone'
    ], [
//    'js:modernizr:minify',
//    'js:main:gzip',
      'css:gzip',
    ], 'server', done);
  });

  // ---------------------------------------------------------------------------
  // [Task] Default
  // ---------------------------------------------------------------------------

  /** default */
  $g.task('default', ['deploy']);
};
