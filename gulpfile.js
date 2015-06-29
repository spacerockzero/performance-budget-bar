'use strict';

/* require deps*/
/*eslint-disable no-multi-spaces*/
var gulp       = require('gulp');
var babel      = require('gulp-babel');
var runSequence = require('gulp-run-sequence');
var clean      = require('gulp-clean');
var eslint     = require('gulp-eslint');
var path       = require('path');
var stylus     = require('gulp-stylus');
var prefix     = require('gulp-autoprefixer');
var cssMin     = require('gulp-css');
var buffer     = require('vinyl-buffer');
var source     = require('vinyl-source-stream');
var globby     = require('globby');
var through    = require('through2');
var gutil      = require('gulp-util');
var browserify = require('browserify');
var cssify     = require('cssify');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');

/* config */
var srcDir       = 'lib';
var srcFiles     = path.join(srcDir, '/**/*');
var srcJS        = path.join(srcDir, '/**/*.js');
var srcCSS       = [path.join(srcDir, '/**/*.css'), path.join(srcDir, '/**/*.styl')];
var distDir      = 'dist';
var distFiles    = path.join(distDir, '/**/*');
var stylusConfig = {};
var prefixConfig = {};
/*eslint-enable  no-multi-spaces*/


/* tasks */

/* build tasks */
gulp.task('clean', function(){
  gulp.src(distFiles)
    .pipe(clean());
});


gulp.task('browserify', function(){
  var bundledStream = through();
  bundledStream
    .pipe(source(path.join('perf-budget-bar.js')))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
      .pipe(babel())
      // .pipe(uglify()) // only on prod
      .on('error', gutil.log)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distDir));
  globby([ path.join(srcJS) ], function(err, entries) {
    // ensure any errors from globby are handled
    if (err) {
      bundledStream.emit('error', err);
      return;
    }
    var b = browserify({
      entries: entries,
      debug: true,
      transform: ['cssify']
    });
    b.bundle().pipe(bundledStream);
  });
  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
});


gulp.task('css', function(){
  gulp.src(path.join(srcDir, '/style.styl'))
    .pipe(stylus(stylusConfig))
    .pipe(prefix(prefixConfig))
    .pipe(cssMin())
    .pipe(gulp.dest(srcDir));
    livereload();
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
  runSequence('clean', ['css'], ['browserify'], function(){
    console.log('Build completed!');
    livereload();
  });
});



/* main devtime sequence */
gulp.task('dev', function(){
  runSequence('build', function(){
    console.log('dev complete');
  });
});


/* watches */
gulp.task('watch', function(){
  livereload.listen({reloadPage: 'index.html'});
  gulp.watch(srcFiles, ['dev']);
});

/* default */
gulp.task('default', ['build']);
