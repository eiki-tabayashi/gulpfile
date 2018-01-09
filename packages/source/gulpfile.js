'use strict';

var path = require('path');
var gulp = require('gulp');
var argv = require('yargs').options('m', { alias: 'mode', default: 'development' }).argv;

// -------------------------------------------------------------------------------------------------
// streams
// -------------------------------------------------------------------------------------------------

var connect  = require('gulp-connect');
var sequence = require('run-sequence');
var pipe     = Object.defineProperties({}, {
src                 : { get: function() { return gulp.src.bind(gulp); } },
dest                : { get: function() { return gulp.dest.bind(gulp); } },
autoprefixer        : { get: function() { return require('gulp-autoprefixer'); } },
bless               : { get: function() { return require('gulp-bless'); } },
combineMediaQueries : { get: function() { return require('gulp-combine-media-queries'); } },
nomq                : { get: function() { return require('gulp-no-media-queries'); } },
cssmin              : { get: function() { return require('gulp-cssmin'); } },
csso                : { get: function() { return require('gulp-csso'); } },
debug               : { get: function() { return require('gulp-debug'); } },
    filter              : { get: function() { return require('gulp-filter'); } },
    gm                  : { get: function() { return require('gulp-gm'); } },
gzip                : { get: function() { return require('gulp-gzip'); } },
    iconfont            : { get: function() { return require('gulp-iconfont'); } },
    imagemin            : { get: function() { return require('gulp-imagemin'); } },
jade                : { get: function() { return require('gulp-jade'); } },
    beautify            : { get: function() { return require('gulp-jsbeautifier'); } },
plumber             : { get: function() { return require('gulp-plumber'); } },
rename              : { get: function() { return require('gulp-rename'); } },
replace             : { get: function() { return require('gulp-replace'); } },
stylus              : { get: function() { return require('gulp-stylus'); } },
    svgmin              : { get: function() { return require('gulp-svgmin'); } },
    template            : { get: function() { return require('gulp-template'); } },
    uglify              : { get: function() { return require('gulp-uglify'); } },
    webpack             : { get: function() { return require('gulp-webpack'); } },
    aggregate           : { get: function() { return require('gulp.aggregate'); } },
    modernizr           : { get: function() { return require('gulp.modernizr'); } },
    spritesmith         : { get: function() { return require('gulp.spritesmith'); } }
});

pipe.reduce = function(options) {
    options = options || {};
    options.width  = 'undefined' !== typeof options.width  ?  options.width: 0.5;
    options.height = 'undefined' !== typeof options.height ? options.height: 0.5;
    return pipe.gm(function(gmfile, callback) {
        gmfile.size(function(err, size) {
            callback(null, gmfile.resize(size.width * options.width, size.height * options.height));
        });
    });
};

pipe.spritesheet = function(options) {
    var gutil   = require('gulp-util');
    var through = require('through2');
    options = options || {};
    options.glue  = options.glue  || '@';
    options.state = options.state || 'defaults';

    var firstfile, files = [];
    return through.obj(
        function(file, encoding, callback) {
            if (file.isNull()) return callback(null, file);
            if (file.isStream()) return callback(new gutil.PluginError('spritesheet', 'Streaming not supported'));
            if (!firstfile) firstfile = file;
            files.push(file);
            return callback();
        },
        function(callback) {
            if (!files.length) return callback();
            var contents = files.reduce(function(memo, file) {
                var json = JSON.parse(file.contents.toString());
                Object.keys(json).forEach(function(name) {
                    var values = json[name];
                    var pixel  = values.px;
                    var names  = name.split(options.glue);
                    var state  = names.length > 1 ? names.pop() : options.state;

                    name = names.join('');
                    memo[name] = memo[name] || {};
                    memo[name][state] = {
                        image  : values.escaped_image,
                        width  : pixel.width,
                        height : pixel.height,
                        top    : pixel.offset_y,
                        left   : pixel.offset_x
                    };
                });
                return memo;
            }, {});
            this.push(new gutil.File({
                cwd      : firstfile.cwd,
                base     : firstfile.base,
                path     : path.join(firstfile.base, path.basename(firstfile.path)),
                contents : new Buffer(JSON.stringify(contents))
            }));
            return callback();
        }
   );
};

pipe.jsonmerge = function() {
    var gutil   = require('gulp-util');
    var through = require('through2');
    var merge   = require('deepmerge');
    var firstfile, files = [];

    return through.obj(
        function(file, encoding, callback) {
            if (file.isNull()) return callback(null, file);
            if (file.isStream()) return callback(new gutil.PluginError('jsonmerge', 'Streaming not supported'));
            if (!firstfile) firstfile = file;
            files.push(file);
            return callback();
        },
        function(callback) {
            if (!files.length) return callback();
            var contents = files.reduce(function(memo, file) {
                var json = JSON.parse(file.contents.toString());
                return merge(memo, json || {});
            }, {});
            this.push(new gutil.File({
                cwd      : firstfile.cwd,
                base     : firstfile.base,
                path     : path.join(firstfile.base, path.basename(firstfile.path)),
                contents : new Buffer(JSON.stringify(contents))
            }));
            return callback();
        }
   );
};

// -------------------------------------------------------------------------------------------------
// config
// -------------------------------------------------------------------------------------------------

var mode = process.env.NODE_ENV || argv.mode || 'development';
var join = path.join;
var findup = require('findup-sync');
var src  = findup('src');
var dest = '';
var root = '';

if ('production' === mode) {
    console.log('Mode: production mode');
    dest = findup('dest');
    root = findup('public_html') || findup('httpdocs') || dest;
} else {
    if ('development' !== mode)
        console.log('Undefined mode: ' + mode + '.');
    console.log('Mode: development mode');
    dest = findup('test');
    root = dest;
}
console.log('Root: ' + root);
console.log('Dest: ' + dest);

var cfg = {
    html: {
        main: {
            build: {
                src  : join(src, '*.jade'),
                dest : dest
            }
        }
    },
    css: {
        rsrc: {
            clone: {
                src  : join(src, 'styles', 'htc', '**', '*'),
                dest : join(root, 'htc')
            }
        },
        main: {
            build: {
                src  : join(src, 'styles', '*.styl'),
                dest : join(dest, 'styles')
            },
            bless: {
                src  : [ join(dest, 'styles', '*.css'), '!' + join(dest, 'styles', '*.*.css') ],
                dest : join(dest, 'styles')
            },
            minify: {
                src  : [ join(dest, 'styles', '*.css'), '!' + join(dest, 'styles', '*.min.css') ],
                dest : join(dest, 'styles')
            },
            gzip: {
                src  : [ join(dest, 'styles', '*.min.css'), '!' + join(dest, 'styles', '*.gz') ],
                dest : join(dest, 'styles')
            },
            nomq: {
                src  : [ join(dest, 'styles', '*.css'), '!' + join(dest, 'styles', '*.*.css') ],
                dest : join(dest, 'styles')
            }
        }
    },
    js: {
        rsrc: {
            clone: {
                src  : join(src, 'scripts', 'vendors', '**', '*'),
                dest : join(dest, 'scripts', 'vendors')
            }
        },
        modernizr: {
            build: {
                src  : join(src, 'scripts', 'modernizr.json'),
                dest : join(dest, 'scripts', 'vendors', 'modernizr')
            },
            minify: {
                src  : join(dest, 'scripts', 'vendors', 'modernizr', 'modernizr.js'),
                dest : join(dest, 'scripts', 'vendors', 'modernizr')
            }
        },
        init: {
            build: {
                src  : join(src, 'scripts', 'init.js'),
                dest : join(dest, 'scripts')
            },
            minify: {
                src  : join(dest, 'scripts', 'init.js'),
                dest : join(dest, 'scripts')
            },
            gzip: {
                src  : join(dest, 'scripts', 'init.min.js'),
                dest : join(dest, 'scripts')
            }
        },
        main: {
            build: {
                src  : join(src, 'scripts', 'main.js'),
                dest : join(dest, 'scripts')
            },
            minify: {
                src  : join(dest, 'scripts', 'main.js'),
                dest : join(dest, 'scripts')
            },
            gzip: {
                src  : join(dest, 'scripts', 'main.min.js'),
                dest : join(dest, 'scripts')
            }
        },
        ie: {
            build: {
                src  : join(src, 'scripts', 'ie.js'),
                dest : join(dest, 'scripts')
            },
            minify: {
                src  : join(dest, 'scripts', 'ie.js'),
                dest : join(dest, 'scripts')
            }
        }
    },
    media: {
        retina: {
            build: {
                src  : join(src, 'media', '**', '*'),
                dest : join(dest, 'media')
            }
        },
        reduce: {
            build: {
                src  : join(src, 'media', '**', '*'),
                dest : join(dest, 'media')
            }
        }
    },
    sprites: {
        retina: {
            build: {
                img: {
                    src  : join(src, 'sprites', '**', '*.png'),
                    dest : join(dest, 'media')
                }
            }
        },
        reduce: {
            build: {
                img: {
                    src  : join(src, 'sprites', '**', '*.png'),
                    dest : join(dest, 'media')
                },
                css: {
                    dest : join(src, 'styles', 'sprites')
                }
            }
        }
    },
    fonts: {
        rsrc: {
            clone: {
                src  : join(src, 'fonts', '**', '*'),
                dest : join(dest, 'fonts')
            }
        }
    },
    icons: {
        main: {
            build: {
                font: {
                    src  : join(src, 'icons', '**', '*.svg'),
                    dest : join(dest, 'fonts')
                },
                css: {
                    tmpl : join(src, 'components', 'iconfont', 'styles', 'template.styl'),
                    dest : join(src, 'styles', 'icons')
                }
            }
        }
    }
};

// -------------------------------------------------------------------------------------------------
// watch
// -------------------------------------------------------------------------------------------------

gulp.task('watch', function() {
    gulp.watch(cfg.icons.main.build.font.src,    [ 'icons:main:build' ]);
    gulp.watch(cfg.icons.main.build.css.src,     [ 'icons:main:build' ]);
    gulp.watch(cfg.sprites.retina.build.img.src, [ 'sprites:retina:build' ]);
    gulp.watch(cfg.sprites.reduce.build.img.src, [ 'sprites:reduce:build' ]);
    gulp.watch(cfg.media.retina.build.src,       [ 'media:retina:build' ]);
    gulp.watch(cfg.media.reduce.build.src,       [ 'media:reduce:build' ]);
    //gulp.watch(cfg.fonts.rsrc.clone.src,         [ 'fonts:rsrc:clone' ]);
    //gulp.watch(cfg.js.rsrc.clone.src,            [ 'js:rsrc:clone' ]);
    //gulp.watch(cfg.css.rsrc.clone.src,           [ 'css:rsrc:clone' ]);

    gulp.watch(cfg.js.modernizr.build.src,       [ 'js:modernizr:build' ]);
    gulp.watch(cfg.js.init.build.src,            [ 'js:init:build' ]);
    gulp.watch(cfg.js.main.build.src,            [ 'js:main:build' ]);
    //gulp.watch(cfg.html.main.build.src,          [ 'html:main:build' ]);
    //gulp.watch(cfg.css.main.build.src,           [ 'css:main:build' ]);
});

// -------------------------------------------------------------------------------------------------
// server
// -------------------------------------------------------------------------------------------------

gulp.task('server', function() {
    if ('development' === mode) {
        connect.server({
            root: cfg.html.main.build.dest,
            livereload: true
        });
    }
});

// -------------------------------------------------------------------------------------------------
// default
// -------------------------------------------------------------------------------------------------

if ('production' === mode) {
    gulp.task('default', [ 'deploy' ]);
} else {
    gulp.task('default', [ 'server', 'watch' ]);
}

// -------------------------------------------------------------------------------------------------
// deploy
// -------------------------------------------------------------------------------------------------

if ('production' === mode) {
    gulp.task('deploy', function(done) {
        sequence(
            [
                'icons:main:build',
                'sprites:retina:build',
                'sprites:reduce:build',
                'media:retina:build',
                'media:reduce:build',
                'fonts:rsrc:clone',
                'js:rsrc:clone',
                'css:rsrc:clone'
            ],
            [
                'js:modernizr:minify',
                'js:init:gzip',
                'js:main:gzip',
                'css:main:gzip'
            ],
            done
        );
    });
} else {
    gulp.task('deploy', function(done) {
        sequence(
            [
                'icons:main:build',
                'sprites:retina:build',
                'sprites:reduce:build',
                'media:retina:build',
                'media:reduce:build',
                'fonts:rsrc:clone',
                'js:rsrc:clone',
                'css:rsrc:clone'
            ],
            [
                'js:modernizr:build',
                'js:init:build',
                'js:main:build',
                'html:main:build',
                'css:main:build'
            ],
            'server',
            'watch',
            done
       );
    });
}

// -------------------------------------------------------------------------------------------------
// html
// -------------------------------------------------------------------------------------------------

gulp.task('html:main:build', function() {
    if ('production' !== mode) {
        return  pipe.src(cfg.html.main.build.src)
                    .pipe(pipe.plumber())
                    .pipe(pipe.jade({ basedir: __dirname }))
                    .pipe(pipe.beautify({ html: { indentSize: 2, indentChar: ' ' } }))
                    .pipe(pipe.replace(new RegExp('(<!-->)\n(<html)', 'i'), '$1$2'))
                    .pipe(pipe.replace(new RegExp('\n(<!--<!\[endif\]-->)', 'i'), '$1'))
                    .pipe(pipe.replace(new RegExp('\n+', 'g'), "\n"))
                    .pipe(pipe.dest(cfg.html.main.build.dest))
                    .pipe(connect.reload({ stream: true }));
    }
});

// -------------------------------------------------------------------------------------------------
// css
// -------------------------------------------------------------------------------------------------

gulp.task('css:rsrc:clone', function() {
    return  pipe.src(cfg.css.rsrc.clone.src)
                .pipe(pipe.dest(cfg.css.rsrc.clone.dest));
});

gulp.task('css:main:build', function() {
    var stylus  = require('stylus');
    var numcode = require('numcode');
    var paths   = [ path.resolve(join(src, 'components')), path.resolve(cfg.media.retina.build.dest) ];
    return  pipe.src(cfg.css.main.build.src)
                .pipe(pipe.plumber())
                .pipe(pipe.stylus({
                    'define': {
                        fontsURL: '../fonts',
                        dataURL: stylus.url({ paths: paths }),
                        numcode: numcode
                    },
                    'paths': paths,
                    'include css': true,
                    'compress': false
                }))
                .pipe(pipe.replace(new RegExp('(progid:)\s+', 'g'), '$1'))
                .pipe(pipe.combineMediaQueries())
                .pipe(pipe.autoprefixer([ 'last 2 versions' ]))
                .pipe(pipe.csso())
                .pipe(pipe.beautify({ css: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.css.main.build.dest))
                .pipe(connect.reload({ stream: true }));
});

gulp.task('css:main:bless', [ 'css:main:build' ], function() {
    return  pipe.src(cfg.css.main.bless.src)
                .pipe(pipe.bless())
                .pipe(pipe.rename({ suffix: '.bless' }))
                .pipe(pipe.dest(cfg.css.main.bless.dest));
});

gulp.task('css:main:minify', [ 'css:main:bless' ], function() {
    return  pipe.src(cfg.css.main.minify.src)
                .pipe(pipe.cssmin())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.css.main.minify.dest));
});

gulp.task('css:main:gzip', [ 'css:main:minify' ], function() {
    return  pipe.src(cfg.css.main.gzip.src)
                .pipe(pipe.gzip())
                .pipe(pipe.dest(cfg.css.main.gzip.dest));
});

gulp.task('css:main:nomq', ['css:main:build'], function() {
    return  pipe.src(cfg.css.main.nomq.src)
                .pipe(pipe.nomq())
                .pipe(pipe.rename(function(path) {
                    path.basename = 'ie8';
                }))
                .pipe(pipe.dest(cfg.css.main.nomq.dest));
});

// -------------------------------------------------------------------------------------------------
// js
// -------------------------------------------------------------------------------------------------

gulp.task('js:rsrc:clone', function() {
    return  pipe.src(cfg.js.rsrc.clone.src)
                .pipe(pipe.dest(cfg.js.rsrc.clone.dest));
});

gulp.task('js:modernizr:build', function() {
  return  pipe.src(cfg.js.modernizr.build.src)
              .pipe(pipe.plumber())
              .pipe(pipe.modernizr({ mode: false, name: 'modernizr' }))
              .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
              .pipe(pipe.dest(cfg.js.modernizr.build.dest))
              .pipe(connect.reload({ stream: true }));
});

gulp.task('js:modernizr:minify', [ 'js:modernizr:build' ], function() {
    return  pipe.src(cfg.js.modernizr.minify.src)
                .pipe(pipe.uglify())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.js.modernizr.minify.dest));
});

gulp.task('js:init:build', function() {
    var webpack = require('webpack');
    return  pipe.src(cfg.js.init.build.src)
        .pipe(pipe.plumber())
        .pipe(pipe.webpack({
            output: {
                publicPath: './',
                filename: "init.js",
                namedChunkFilename: "[name].js",
            },
            module: {
                loaders: [ { test: /\.json$/, loader: 'json' } ]
            },
            resolve: {
                modulesDirectories: [ 'node_modules', 'bower_components' ],
            },
            plugins: [
                new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', [ 'main' ]))
            ]
    }))
    .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
    .pipe(pipe.dest(cfg.js.init.build.dest))
    .pipe(connect.reload());
});

gulp.task('js:init:minify', [ 'js:init:build' ], function() {
    return  pipe.src(cfg.js.init.minify.src)
                .pipe(pipe.uglify())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.js.init.minify.dest));
});

gulp.task('js:init:gzip', [ 'js:init:minify' ], function() {
    return  pipe.src(cfg.js.init.gzip.src)
                .pipe(pipe.gzip())
                .pipe(pipe.dest(cfg.js.init.gzip.dest));
});

gulp.task('js:main:build', function() {
    var webpack = require('webpack');
    return  pipe.src(cfg.js.main.build.src)
                .pipe(pipe.plumber())
                .pipe(pipe.webpack({
                    output: {
                        publicPath: './',
                        filename: "main.js",
                        namedChunkFilename: "[name].js",
                    },
                    resolve: {
                        modulesDirectories: [ 'node_modules', 'bower_components' ],
                    },
                    plugins: [
                        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', [ 'main' ]))
                    ]
                }))
                .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.js.main.build.dest))
                .pipe(connect.reload());
});

gulp.task('js:main:minify', [ 'js:main:build' ], function() {
    return  pipe.src(cfg.js.main.minify.src)
                .pipe(pipe.uglify())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.js.main.minify.dest));
});

gulp.task('js:main:gzip', [ 'js:main:minify' ], function() {
    return  pipe.src(cfg.js.main.gzip.src)
                .pipe(pipe.gzip())
                .pipe(pipe.dest(cfg.js.main.gzip.dest));
});

gulp.task('js:ie:build', function() {
    var webpack = require('webpack');
    return  pipe.src(cfg.js.ie.build.src)
                .pipe(pipe.plumber())
                .pipe(pipe.webpack({
                    output: {
                        publicPath: './',
                        filename: "ie.js",
                        namedChunkFilename: "[name].js",
                    },
                    resolve: {
                        modulesDirectories: [ 'node_modules', 'bower_components' ],
                    },
                    plugins: [
                        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', [ 'main' ]))
                    ]
                }))
                .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.js.ie.build.dest))
                .pipe(connect.reload());
});

gulp.task('js:ie:minify', [ 'js:ie:build' ], function() {
    return  pipe.src(cfg.js.ie.minify.src)
                .pipe(pipe.uglify())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.js.ie.minify.dest));
});


// -------------------------------------------------------------------------------------------------
// fonts
// -------------------------------------------------------------------------------------------------

gulp.task('fonts:rsrc:clone', function() {
    return  pipe.src(cfg.fonts.rsrc.clone.src)
                .pipe(pipe.dest(cfg.fonts.rsrc.clone.dest));
});

// -------------------------------------------------------------------------------------------------
// media
// -------------------------------------------------------------------------------------------------

gulp.task('media:retina:build', function() {
    var filter1x = pipe.filter([ '**/*.*', '!**/*@1x.* ' ]);
    return  pipe.src(cfg.media.retina.build.src)
                .pipe(filter1x)
                .pipe(pipe.rename({ suffix: '@2x' }))
                .pipe(pipe.imagemin())
                .pipe(pipe.dest(cfg.media.retina.build.dest));
});

gulp.task('media:reduce:build', function() {
    var filter1x = pipe.filter([ '**/*.*', '!**/*@1x.* ' ]);
    return  pipe.src(cfg.media.reduce.build.src)
                .pipe(filter1x)
                .pipe(pipe.reduce())
                .pipe(filter1x.restore())
                .pipe(pipe.rename(function(path) { path.basename = path.basename.replace(/@1x/, ''); }))
                .pipe(pipe.imagemin())
                .pipe(pipe.dest(cfg.media.reduce.build.dest));
});

// -------------------------------------------------------------------------------------------------
// sprites
// -------------------------------------------------------------------------------------------------

gulp.task('sprites:retina:build', function() {
    return  pipe.src(cfg.sprites.retina.build.img.src)
                .pipe(pipe.aggregate({
                    group: function(file) { return path.basename(path.dirname(file.path)); },
                    aggregate: function(group, files, deferred) {
                        var sprite;
                        sprite = pipe.src(files.map(function(file) { return file.path; }))
                                        .pipe(pipe.spritesmith({
                                            imgName: group + '.png',
                                            cssName: group + '.json',
                                            algorithm: 'binary-tree',
                                            padding: 6
                                        }));
                        sprite.on('finish', function() {
                            sprite.img.pipe(pipe.rename({ suffix: '@2x' }))
                                        .pipe(pipe.dest(cfg.sprites.retina.build.img.dest))
                                        .on('end', function() { deferred.resolve(); });
                        });
                        return deferred.promise;
                    }
                }));
});

gulp.task('sprites:reduce:build', function() {
    var Workspace = require('workspace');
    return  pipe.src(cfg.sprites.reduce.build.img.src)
                .pipe(pipe.aggregate({
                    group: function(file) { return path.basename(path.dirname(file.path)); },
                    aggregate: function(group, files, deferred) {
                        var tmpdir, sprite;
                        tmpdir =  new Workspace();
                        sprite =  pipe.src(files.map(function(file) { return file.path; }))
                                        .pipe(pipe.reduce())
                                        .pipe(pipe.dest(tmpdir.path))
                                        .pipe(pipe.spritesmith({
                                            imgName: group + '.png',
                                            cssName: group + '.json',
                                            algorithm: 'binary-tree',
                                            padding: 3
                                        }));
                        sprite.on('finish', function() {
                            sprite.img.pipe(pipe.dest(cfg.sprites.reduce.build.img.dest))
                                        .on('end', function() { tmpdir.remove(); });
                            sprite.css.pipe(pipe.spritesheet())
                                    .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
                                    .pipe(pipe.dest(cfg.sprites.reduce.build.css.dest))
                                    .on('end', function() { deferred.resolve(); });
                        });
                        return deferred.promise;
                    }
                }));
});

// -------------------------------------------------------------------------------------------------
// iconfont
// -------------------------------------------------------------------------------------------------

gulp.task('icons:main:build', function() {
    return  pipe.src(cfg.icons.main.build.font.src)
                .pipe(pipe.svgmin())
                .pipe(pipe.aggregate({
                    group: function(file) { return path.basename(path.dirname(file.path)); },
                    aggregate: function(group, files, deferred) {
                        pipe.src(files.map(function(file) { return file.path; }))
                            .pipe(pipe.iconfont({
                                fontName: group,
                                normalize: true,
                                fontHeight: 448,
                                descent: 64
                            }))
                            .on('codepoints', function(glyphs) {
                                pipe.src(cfg.icons.main.build.css.tmpl)
                                    .pipe(pipe.template({
                                        fontname: group,
                                        fonturl: 'fontsURL',
                                        glyphs: glyphs.map(function(glyph) {
                                            return { name: glyph.name, codepoint: glyph.codepoint.toString(16) };
                                        })
                                    }))
                                    .pipe(pipe.rename({ basename: group }))
                                    .pipe(pipe.dest(cfg.icons.main.build.css.dest))
                                    .on('end', function() { deferred.resolve(); });
                            })
                            .pipe(pipe.dest(cfg.icons.main.build.font.dest));
                        return deferred.promise;
                    }
                }));
});
//
