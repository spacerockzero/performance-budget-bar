'use strict';

/* require deps*/
/*eslint-disable no-multi-spaces*/
var gulp        = require('gulp');
var runSequence = require('gulp-run-sequence');
var clean       = require('gulp-clean');
var browserify  = require('browserify');
var hbsfy       = require('hbsfy');
var eslint      = require('gulp-eslint');
var path        = require('path');
var stylus      = require('gulp-stylus');
var prefix      = require('gulp-autoprefixer');
/*eslint-enable  no-multi-spaces*/

/* config */
var srcDir = 'lib';
var srcFiles = path.join(srcDir, '/**/*');
var distDir = 'dist';
var distFiles = path.join(distDir, '/**/*');
var stylusConfig = {};
var prefixConfig = {};


/* tasks */

/* build tasks */
gulp.task('clean', function(){
  gulp.src(distFiles)
    .pipe(clean());
});

gulp.task('browserify', function(){
  return gulp.src(srcFiles)
    .pipe() //TODO: browserify this thing
    .pipe(gulp.dest(distDir));
});

gulp.task('css', function(){
  gulp.src(path.join(srcDir, '/style.styl'))
    .pipe(stylus(stylusConfig))
    .pipe(prefix(prefixConfig))
    .pipe(gulp.dest(distDir));
});

/* testing/quality tasks */
gulp.task('lint', function(){
  return gulp.src(srcFiles)
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.formatEach('compact', process.stderr));
});

gulp.task('test', function(){
  // run the tests
  // TODO: make tests, plug them in
});


/* main build sequence */
gulp.task('build', function(){
  runSequence('clean', ['browserify'], function(){
    console.log('Build completed!');
  });
});


/* main devtime sequence */
gulp.task('dev', function(){
  runSequence('build', ['lint', 'test'], function(){
    console.log('dev complete');
  });
});

/* watches */
gulp.task('watch', function(){
  gulp.watch(srcFiles, 'dev');
});
