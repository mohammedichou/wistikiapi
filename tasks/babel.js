const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const config = require('./gulp.config');

/**
 * $ gulp babel:test
 * description: Clean test compiled files & sourcemaps
 */
gulp.task('babel:test', ['babel:src', 'clean:test'], () =>
  gulp.src(config.test.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: ['transform-runtime']
    }))
    .pipe(sourcemaps.write('.', { sourceRoot: config.testRoot }))
    .pipe(gulp.dest(config.test.dist)));

/**
 * $ gulp babel:src
 * description: Compile es7 files to es6 and put them in dist directory
 */
gulp.task('babel:src', ['clean:dist', 'babel:config'], () =>
  gulp.src(config.js.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: config.sourceRoot }))
    .pipe(gulp.dest(config.js.dist)));

gulp.task('babel:config', ['config', 'copy:yml', 'clean:config'], () =>
  gulp.src(`${config.config.src}.js`)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: config.configRoot }))
    .pipe(gulp.dest(config.config.dist)));
/**
 * $ gulp babel
 * description: Compile all es6 files to es5 and put them in dist directories
 */
gulp.task('babel', ['babel:src', 'babel:test']);
