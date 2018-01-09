'use strict';

var path = require('path');
var gulp = require('gulp');
var argv = require('yargs').options('m', { alias: 'mode', default: 'development' }).argv;

// -------------------------------------------------------------------------------------------------
// config
// -------------------------------------------------------------------------------------------------

var mode = process.env.NODE_ENV || argv.mode || 'development';
var main = path.resolve(process.cwd(), '..');
var comp = path.relative(process.cwd(), process.env.INIT_CWD).split(path.sep)[0];
var join = path.join;

console.log('Component: ', comp);
var cfg = {};
if ('production' === mode) {
    console.log('Mode: production mode');
    console.log('Output: ', main);
    cfg = {
        css: {
            rsrc: {
                clone: {
                    src  : join(comp, 'styles', 'htc', '**', '*'),
                    dest : join(main, 'styles', 'htc')
                }
            }
        },
        js: {
            rsrc: {
                clone: {
                    src  : join(comp, 'scripts', 'vendors', '**', '*'),
                    dest : join(main, 'scripts', 'vendors')
                }
            },
            modernizr: {
                merge: {
                    src  : join(comp, 'scripts', 'modernizr.json'),
                    dest : join(main, 'scripts')
                }
            }
        },
        media: {
            rsrc: {
                clone: {
                    src  : join(comp, 'media', '**', '*'),
                    dest : join(main, 'media')
                }
            }
        },
        sprites: {
            rsrc: {
                clone: {
                    src  : join(comp, 'sprites', '**', '*.png'),
                    dest : join(main, 'sprites')
                }
            }
        },
        fonts: {
            rsrc: {
                clone: {
                    src  : join(comp, 'fonts', '**', '*'),
                    dest : join(main, 'fonts')
                }
            }
        },
        icons: {
            rsrc: {
                clone: {
                    src  : join(comp, 'icons', '**', '*.svg'),
                    dest : join(main, 'icons')
                }
            }
        }
    };
} else {
    if ('development' !== mode) {
        console.log('Undefined mode: ' + mode + '.');
    }
    console.log('Mode: development mode');
    console.log('Output: ', join(comp, 'test'));

    cfg = {
        html: {
            main: {
                build: {
                    src  : join(comp, 'test', 'src', '*.jade'),
                    dest : join(comp, 'test')
                }
            }
        },
        css: {
            rsrc: {
                clone: {
                    src  : join(comp, 'styles', 'htc', '**', '*'),
                    dest : join(comp, 'test', 'htc')
                }
            },
            main: {
                build: {
                    src  : join(comp, 'test', 'src', 'styles', '*.styl'),
                    dest : join(comp, 'test', 'styles')
                },
                minify: {
                    src  : [ join(comp, 'test', 'styles', '*.css'), '!' + join(comp, 'test', 'styles', '*.*.css') ],
                    dest : join(comp, 'test', 'styles')
                },
                bless: {
                    src  : join(comp, 'test', 'styles', '*.min.css'),
                    dest : join(comp, 'test', 'styles')
                },
                compress: {
                    src  : join(comp, 'test', 'styles', '*.min.css'),
                    dest : join(comp, 'test', 'styles')
                }
            }
        },
        js: {
            rsrc: {
                clone: {
                    src  : join(comp, 'scripts', 'vendors', '**', '*'),
                    dest : join(comp, 'test', 'scripts', 'vendors')
                }
            },
            modernizr: {
                build: {
                    src  : join(comp, 'scripts', 'modernizr.json'),
                    dest : join(comp, 'test', 'scripts', 'vendors')
                },
                minify: {
                    src  : join(comp, 'test', 'src', 'scripts', 'vendors', '*.js'),
                    dest : join(comp, 'test', 'src', 'scripts', 'vendors')
                }
            },
            init: {
                build: {
                    src  : join(comp, 'test', 'src', 'scripts', 'init.js'),
                    dest : join(comp, 'test', 'scripts')
                },
                minify: {
                    src  : join(comp, 'test', 'scripts', 'init.js'),
                    dest : join(comp, 'test', 'scripts')
                },
                compress: {
                    src  : join(comp, 'test', 'scripts', 'init.js'),
                    dest : join(comp, 'test', 'scripts')
                }
            },
            main: {
                build: {
                    src  : join(comp, 'test', 'src', 'scripts', 'main.js'),
                    dest : join(comp, 'test', 'scripts')
                },
                minify: {
                    src  : join(comp, 'test', 'scripts', 'main.js'),
                    dest : join(comp, 'test', 'scripts')
                },
                compress: {
                    src  : join(comp, 'test', 'scripts', 'main.js'),
                    dest : join(comp, 'test', 'scripts')
                }
            }
        },
        media: {
            rsrc: {
                clone: {
                    src  : join(comp, 'media', '**', '*'),
                    dest : join(comp, 'test', 'src', 'media')
                }
            },
            retina: {
                build: {
                    src  : join(comp, 'test', 'src', 'media', '**', '*'),
                    dest : join(comp, 'test', 'media')
                }
            },
            reduce: {
                build: {
                    src  : join(comp, 'test', 'src', 'media', '**', '*'),
                    dest : join(comp, 'test', 'media')
                }
            }
        },
        sprites: {
            rsrc: {
                clone: {
                    src  : join(comp, 'sprites', '**', '*.png'),
                    dest : join(comp, 'test', 'src', 'sprites')
                }
            },
            retina: {
                build: {
                    img: {
                        src  : join(comp, 'sprites', '**', '*.png'),
                        dest : join(comp, 'test', 'media')
                    },
                    css: {
                        dest : join(comp, 'test', 'src', 'styles', 'sprites')
                    }
                }
            },
            reduce: {
                build: {
                    img: {
                        src  : join(comp, 'sprites', '**', '*.png'),
                        dest : join(comp, 'test', 'media')
                    },
                    css: {
                        dest : join(comp, 'test', 'src', 'styles', 'sprites')
                    }
                }
            }
        },
        fonts: {
            rsrc: {
                clone: {
                    src  : join(comp, 'fonts', '**', '*'),
                    dest : join(comp, 'test', 'fonts')
                }
            }
        },
        icons: {
            rsrc: {
                clone: {
                    src  : join(comp, 'icons', '**', '*.svg'),
                    dest : join(comp, 'test', 'src', 'icons')
                }
            },
            main: {
                build: {
                    font: {
                        src  : join(comp, 'test', 'src', 'icons', '**', '*.svg'),
                        dest : join(comp, 'test', 'fonts')
                    },
                    css: {
                        tmpl : join(__dirname, 'iconfont', 'styles', 'template.styl'),
                        dest : join(comp, 'test', 'src', 'styles', 'icons')
                    }
                }
            }
        }
    };
}

// -------------------------------------------------------------------------------------------------
// streams
// -------------------------------------------------------------------------------------------------

var connect  = require('gulp-connect');
var sequence = require('run-sequence');
var pipe = Object.defineProperties({}, {
  src                 : { get: function() { return gulp.src.bind(gulp); } }
, dest                : { get: function() { return gulp.dest.bind(gulp); } }
, autoprefixer        : { get: function() { return require('gulp-autoprefixer'); } }
, bless               : { get: function() { return require('gulp-bless'); } }
, clone               : { get: function() { return require('gulp-clone'); } }
, combineMediaQueries : { get: function() { return require('gulp-combine-media-queries'); } }
, cssmin              : { get: function() { return require('gulp-cssmin'); } }
, csso                : { get: function() { return require('gulp-csso'); } }
, debug               : { get: function() { return require('gulp-debug'); } }
, filter              : { get: function() { return require('gulp-filter'); } }
, gm                  : { get: function() { return require('gulp-gm'); } }
, gzip                : { get: function() { return require('gulp-gzip'); } }
, iconfont            : { get: function() { return require('gulp-iconfont'); } }
, imagemin            : { get: function() { return require('gulp-imagemin'); } }
, jade                : { get: function() { return require('gulp-jade'); } }
, beautify            : { get: function() { return require('gulp-jsbeautifier'); } }
, plumber             : { get: function() { return require('gulp-plumber'); } }
, rename              : { get: function() { return require('gulp-rename'); } }
, replace             : { get: function() { return require('gulp-replace'); } }
, stylus              : { get: function() { return require('gulp-stylus'); } }
, svgmin              : { get: function() { return require('gulp-svgmin'); } }
, template            : { get: function() { return require('gulp-template'); } }
, uglify              : { get: function() { return require('gulp-uglify'); } }
, webpack             : { get: function() { return require('gulp-webpack'); } }
, aggregate           : { get: function() { return require('gulp.aggregate'); } }
, modernizr           : { get: function() { return require('gulp.modernizr'); } }
, spritesmith         : { get: function() { return require('gulp.spritesmith'); } }
});

pipe.reduce = function(options) {
    options = options || {};
    options.width  = 'undefined' !== typeof options.width  ? options.width  : 0.5;
    options.height = 'undefined' !== typeof options.height ? options.height : 0.5;
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
// watch
// -------------------------------------------------------------------------------------------------

gulp.task('watch', function() {
    if ('development' === mode) {
        gulp.watch(cfg.html.main.build.src,          ['html:main:build']);
        gulp.watch(cfg.css.main.build.src,           ['css:main:build']);
        gulp.watch(cfg.js.rsrc.clone.src,            ['js:rsrc:clone']);
        gulp.watch(cfg.js.modernizr.build.src,       ['js:modernizr:build']);
        gulp.watch(cfg.js.init.build.src,            ['js:init:build']);
        gulp.watch(cfg.js.main.build.src,            ['js:main:build']);
        gulp.watch(cfg.media.rsrc.clone.src,         ['media:rsrc:clone']);
        gulp.watch(cfg.media.retina.build.src,       ['media:retina:build']);
        gulp.watch(cfg.media.reduce.build.src,       ['media:reduce:build']);
        gulp.watch(cfg.sprites.rsrc.clone.src,       ['sprites:rsrc:clone']);
        gulp.watch(cfg.sprites.retina.build.img.src, ['sprites:retina:build']);
        gulp.watch(cfg.sprites.reduce.build.img.src, ['sprites:reduce:build']);
        gulp.watch(cfg.fonts.rsrc.clone.src,         ['fonts:rsrc:clone']);
        gulp.watch(cfg.icons.rsrc.clone.src,         ['icons:rsrc:clone']);
        gulp.watch(cfg.icons.main.build.font.src,    ['icons:main:build']);
        gulp.watch(cfg.icons.main.build.css.src,     ['icons:main:build']);
    }
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
    gulp.task('default', ['deploy']);
} else {
    gulp.task('default', ['server', 'watch']);
}

// -------------------------------------------------------------------------------------------------
// deploy
// -------------------------------------------------------------------------------------------------

if ('production' === mode) {
    gulp.task('deploy', [
        'css:rsrc:clone',
        'js:modernizr:merge',
        'js:rsrc:clone',
        'media:rsrc:clone',
        'sprites:rsrc:clone',
        'fonts:rsrc:clone',
        'icons:rsrc:clone'
    ]);
} else {
    gulp.task('deploy', ['default']);
}

// -------------------------------------------------------------------------------------------------
// html
// -------------------------------------------------------------------------------------------------

gulp.task('html:main:build', function() {
    return  pipe.src(cfg.html.main.build.src)
                .pipe(pipe.plumber())
                .pipe(pipe.jade({ basedir: __dirname }))
                .pipe(pipe.beautify({ html: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.replace(new RegExp('(<!-->)\n(<html)', 'i'), '$1$2'))
                .pipe(pipe.replace(new RegExp('\n(<!--<!\[endif\]-->)', 'i'), '$1'))
                .pipe(pipe.replace(new RegExp('\n+', 'g'), "\n"))
                .pipe(pipe.dest(cfg.html.main.build.dest))
                .pipe(connect.reload({ stream: true }));
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
    var paths   = [__dirname, cfg.media.retina.build.dest];
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
                .pipe(pipe.autoprefixer())
                .pipe(pipe.csso())
                .pipe(pipe.beautify({ css: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.css.main.build.dest))
                .pipe(connect.reload({ stream: true }));
});

gulp.task('css:main:compress', ['css:main:build'], function() {
    return  pipe.src(cfg.css.main.compress.src)
                .pipe(pipe.gzip())
                .pipe(pipe.dest(cfg.css.main.compress.dest));
});

gulp.task('css:main:minify', ['css:main:build'], function() {
    return  pipe.src(cfg.css.main.minify.src)
                .pipe(pipe.cssmin())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.css.main.minify.dest));
});

gulp.task('css:main:bless', ['css:main:minify'], function() {
    return  pipe.src(cfg.css.main.bless.src)
                .pipe(pipe.bless())
                .pipe(pipe.rename({ suffix: '.bless' }))
                .pipe(pipe.dest(cfg.css.main.bless.dest));
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
                .pipe(pipe.beautify({ js: { indentSize: 4, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.js.modernizr.build.dest))
                .pipe(connect.reload({ stream: true }));
});

gulp.task('js:modernizr:merge', function() {
    var src = join(cfg.js.modernizr.merge.dest, 'modernizr.json');
    src = Array.isArray(cfg.js.modernizr.merge.src) ? [src].concat(cfg.js.modernizr.merge.src)
                                                    : [ src, cfg.js.modernizr.merge.src ];
    return  pipe.src(src)
                .pipe(pipe.plumber())
                .pipe(pipe.jsonmerge({ src: cfg.js.modernizr.merge.dest }))
                .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.js.modernizr.merge.dest));
});

gulp.task('js:init:build', ['js:modernizr:build'], function() {
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
                        loaders: [{ test: /\.json$/, loader: 'json' }]
                    },
                    resolve: {
                        modulesDirectories: ['node_modules', 'bower_components'],
                    },
                    plugins: [
                        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main']))
                    ]
                }))
                .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.js.init.build.dest))
                .pipe(connect.reload());
});

gulp.task('js:init:minify', ['js:init:build'], function() {
    return  pipe.src(cfg.js.init.minify.src)
                .pipe(pipe.uglify())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.js.init.minify.dest));
});

gulp.task('js:init:compress', ['js:init:build'], function() {
    return  pipe.src(cfg.js.init.compress.src)
                .pipe(pipe.gzip())
                .pipe(pipe.dest(cfg.js.init.compress.dest));
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
                        modulesDirectories: ['node_modules', 'bower_components'],
                    },
                    plugins: [
                        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main']))
                    ]
                }))
                .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
                .pipe(pipe.dest(cfg.js.main.build.dest))
                .pipe(connect.reload());
});

gulp.task('js:main:minify', ['js:main:build'], function() {
    return  pipe.src(cfg.js.main.minify.src)
                .pipe(pipe.uglify())
                .pipe(pipe.rename({ suffix: '.min' }))
                .pipe(pipe.dest(cfg.js.main.minify.dest));
});

gulp.task('js:main:compress', ['js:main:build'], function() {
    return  pipe.src(cfg.js.main.compress.src)
                .pipe(pipe.gzip())
                .pipe(pipe.dest(cfg.js.main.compress.dest));
});

// -------------------------------------------------------------------------------------------------
// media
// -------------------------------------------------------------------------------------------------

gulp.task('media', function(done) {
    sequence('media:rsrc:clone', ['media:retina:build', 'media:reduce:build'], done);
});

gulp.task('media:rsrc:clone', function() {
    return  pipe.src(cfg.media.rsrc.clone.src)
                .pipe(pipe.dest(cfg.media.rsrc.clone.dest));
});

gulp.task('media:retina:build', function() {
    var filter1x = pipe.filter(['**/*.*', '!**/*@1x.*']);
    return  pipe.src(cfg.media.retina.build.src)
                .pipe(filter1x)
                .pipe(pipe.rename({ suffix: '@2x' }))
                .pipe(pipe.imagemin())
                .pipe(pipe.dest(cfg.media.retina.build.dest));
});

gulp.task('media:reduce:build', function() {
    var filter1x = pipe.filter(['**/*.*', '!**/*@1x.*']);
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

gulp.task('sprites', function(done) {
    sequence('sprites:rsrc:clone', ['sprites:retina:build', 'sprites:reduce:build'], done);
});

gulp.task('sprites:rsrc:clone', function() {
    return  pipe.src(cfg.sprites.rsrc.clone.src)
                .pipe(pipe.dest(cfg.sprites.rsrc.clone.dest));
});

gulp.task('sprites:retina:build', function() {
    return  pipe.src(cfg.sprites.retina.build.img.src)
                .pipe(pipe.aggregate({
                    group: function(file) { return path.basename(path.dirname(file.path)); },
                    aggregate: function(group, files, deferred) {
                        var sprite;
                        sprite= pipe.src(files.map(function(file) { return file.path; }))
                                    .pipe(pipe.spritesmith({
                                        imgName: group + '.png',
                                        cssName: group + '.json',
                                        algorithm: 'binary-tree',
                                        padding: 6
                                    }));
                        sprite.on('finish', function() {
                            sprite.img
                                .pipe(pipe.rename({ suffix: '@2x' }))
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
                        tmpdir = new Workspace();
                        sprite= pipe.src(files.map(function(file) { return file.path; }))
                                    .pipe(pipe.reduce())
                                    .pipe(pipe.dest(tmpdir.path))
                                    .pipe(pipe.spritesmith({
                                        imgName: group + '.png',
                                        cssName: group + '.json',
                                        algorithm: 'binary-tree',
                                        padding: 3
                                    }));
                        sprite.on('finish', function() {
                            sprite.img
                                .pipe(pipe.dest(cfg.sprites.reduce.build.img.dest))
                                .on('end', function() { tmpdir.remove(); });
                            sprite.css
                                .pipe(pipe.spritesheet())
                                .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
                                .pipe(pipe.dest(cfg.sprites.reduce.build.css.dest))
                                .on('end', function() { deferred.resolve(); });
                        });
                        return deferred.promise;
                    }
                }));
});

// -------------------------------------------------------------------------------------------------
// fonts
// -------------------------------------------------------------------------------------------------

gulp.task('fonts', function(done) {
    sequence('fonts:rsrc:clone', done);
});

gulp.task('fonts:rsrc:clone', function() {
    return  pipe.src(cfg.fonts.rsrc.clone.src)
                .pipe(pipe.dest(cfg.fonts.rsrc.clone.dest));
});

// -------------------------------------------------------------------------------------------------
// iconfont
// -------------------------------------------------------------------------------------------------

gulp.task('icons', function() {
    sequence('icons:rsrc:clone', 'icons:main:build');
});

gulp.task('icons:rsrc:clone', function() {
    return  pipe.src(cfg.icons.rsrc.clone.src)
                .pipe(pipe.dest(cfg.icons.rsrc.clone.dest));
});

gulp.task('icons:main:build', function() {
    return  pipe.src(cfg.icons.main.build.font.src)
                .pipe(pipe.svgmin())
                .pipe(pipe.aggregate({
                    group: function(file) { return path.basename(path.dirname(file.path)); },
                    aggregate: function(group, files, deferred) {
                        pipe.src(files.map(function(file) { return file.path; }))
                            .pipe(pipe.iconfont({ fontName: group }))
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
