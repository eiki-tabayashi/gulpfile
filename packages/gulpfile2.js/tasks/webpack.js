'use strict';
var Params = require('gulp.plus-parameter');
// var webpack = require('webpack');

module.exports = function(streams) {
  return function(params) {
    return function() {
      params = new Params(params);
      return streams
        .src(
          params.get('src.globs'),
          params.get('src.options')
        )
        .pipe(streams.plumber(params.get('plumber.options')))
        .pipe(streams.webpack(params.get('webpack.options')))
        // {
        //   output: {
        //     publicPath: './',
        //     filename: "ie.js",
        //     namedChunkFilename: "[name].js",
        //   },
        //   resolve: {
        //     modulesDirectories: [ 'node_modules', 'bower_components' ],
        //   },
        //   plugins: [
        //     new webpack.ResolverPlugin(
        //       new webpack.ResolverPlugin
        //         .DirectoryDescriptionFilePlugin('bower.json', [ 'main' ])
        //     )
        //   ]
        // }
        // .pipe(streams.beautify({js: {indentSize: 2, indentChar: ' '}}))
        .pipe(streams.beautify(params.get('beautify.options')))
        .pipe(streams.dest(
          params.get('dest.folder'),
          params.get('dest.options')
        ));
    };
  };
};

// gulp.task('js:init:build', function() {
//     var webpack = require('webpack');
//     return  pipe.src(cfg.js.init.build.src)
//         .pipe(pipe.plumber())
//         .pipe(pipe.webpack({
//             output: {
//                 publicPath: './',
//                 filename: "init.js",
//                 namedChunkFilename: "[name].js",
//             },
//             module: {
//                 loaders: [ { test: /\.json$/, loader: 'json' } ]
//             },
//             resolve: {
//                 modulesDirectories: [ 'node_modules', 'bower_components' ],
//             },
//             plugins: [
//                 new webpack.ResolverPlugin(new webpack.ResolverPlugin.
//                    DirectoryDescriptionFilePlugin('bower.json', [ 'main' ]))
//             ]
//     }))
//     .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' } }))
//     .pipe(pipe.dest(cfg.js.init.build.dest))
//     .pipe(connect.reload());
// });

// gulp.task('js:main:build', function() {
//     var webpack = require('webpack');
//     return  pipe.src(cfg.js.main.build.src)
//                 .pipe(pipe.plumber())
//                 .pipe(pipe.webpack({
//                     output: {
//                         publicPath: './',
//                         filename: "main.js",
//                         namedChunkFilename: "[name].js",
//                     },
//                     resolve: {
//                         modulesDirectories: [
//                           'node_modules', 'bower_components' ],
//                        },
//                     plugins: [
//                         new webpack.ResolverPlugin(new webpack
//                              .ResolverPlugin.DirectoryDescriptionFilePlugin(
//                                'bower.json', [ 'main' ]))
//                     ]
//                 }))
//                 .pipe(pipe.beautify({ js: { indentSize: 2, indentChar: ' ' }
//                  }))
//                 .pipe(pipe.dest(cfg.js.main.build.dest))
//                 .pipe(connect.reload());
// });
