'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options, paths) {
  function webpack(watch, callback) {
    var webpackOptions = {
      watch: watch,
      module: {
        preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader'}],
        loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}]
      },
      output: { filename: 'index.js' }
    };

    if(watch) {
      webpackOptions.devtool = 'inline-source-map';
    }

    var webpackChangeHandler = function(err, stats) {
      if(err) {
        options.errorHandler('Webpack')(err);
      }
      $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: true
      }));
      browserSync.reload();
      if(watch) {
        watch = false;
        callback();
      }
    };

    return gulp.src(paths.src + '/index.js')
      .pipe($.webpack(webpackOptions, null, webpackChangeHandler))
      .pipe(gulp.dest(paths.tmpServe + '/'));
  }

  gulp.task('scripts', function () {
    return webpack(false);
  });

  gulp.task('scripts:watch', ['scripts'], function (callback) {
    return webpack(true, callback);
  });
};
