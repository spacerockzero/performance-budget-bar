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
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var globby      = require('globby');
var through     = require('through2');
var gutil       = require('gulp-util');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');

/* config */
var srcDir       = 'lib';
var srcFiles     = path.join(srcDir, '/**/*');
var srcJS        = path.join(srcDir, '/**/*.js');
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
  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
    .pipe(source('perf-budget-bar.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
      .pipe(hbsfy())
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write(distDir))
    .pipe(gulp.dest(distDir));

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby([ path.join(srcJS) ], function(err, entries) {
    // ensure any errors from globby are handled
    if (err) {
      bundledStream.emit('error', err);
      return;
    }

    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: []
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream);
  });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
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
