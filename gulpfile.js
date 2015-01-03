'use strict';

var gulp      = require('gulp'),
  sass        = require('gulp-sass'),
  concat      = require('gulp-concat'),
  minifyCSS   = require('gulp-minify-css'),
  connect     = require('gulp-connect'),
  browserSync = require('browser-sync'),
  neat        = require('node-neat').includePaths,
  gutil       = require('gulp-util'),
  imagemin    = require('gulp-imagemin'),
  del         = require('del'),
  rename      = require('gulp-rename');

var paths = {
  css: [
    './bower_components/normalize.css/normalize.css',
    './assets/css/**/*.css'
  ]
};


gulp.task('server', function() {
  return connect.server({
    root: './',
    livereload: true
  });
});


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});


gulp.task('clean:css', function(cb) {
  return del('./assets/css', cb);
});


gulp.task('clean:temp', ['css'], function(cb) {
  return del('./assets/css/temp', cb);
});


gulp.task('sass', ['clean:css'], function () {
  return gulp.src('assets/scss/**/*.scss')
    .pipe(sass({
      includePaths: [
        'assets/scss'].concat(neat),
      style: 'compressed',
      quiet: true
    }).on('error', gutil.log))
    .pipe(gulp.dest('./assets/css/temp'));
});


gulp.task('css', ['sass'], function (cb) {
  return gulp.src(paths.css)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', function () {
  return gulp.src('./assets/images/*')
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest('./assets/images/'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

gulp.task('reload', function () {
  browserSync.reload();
});


gulp.task('watch', function () {
  gulp.watch(['./assets/scss/**/*.scss'], ['clean:css', 'sass', 'css', 'clean:temp']);
  gulp.watch(['./assets/images/**/*'], ['images']);
  gulp.watch(['*.html'], ['reload']);
});


gulp.task('default', ['server', 'browser-sync', 'clean:css', 'sass', 'css', 'clean:temp', 'images', 'watch']);
