'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const istanbul = require('gulp-istanbul');

let testFiles = ['./test/test_harness.js'];
var scriptFiles = ['./*.js', './models/*.js', './routes/*.js', './lib/*.js'];

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' },
  });
});

gulp.task('watch', () => {
  gulp.watch([scriptFiles, testFiles], ['lint']);
});

gulp.task('pre-test', () => (
  gulp.src(scriptFiles)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
));

gulp.task('mocha', ['pre-test'], () =>
  gulp.src(testFiles, { read: false })
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    })
);

gulp.task('default', ['start', 'watch', 'lint']);
