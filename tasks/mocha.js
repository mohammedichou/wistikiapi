const gulp = require('gulp');
const mocha = require('gulp-mocha');
const config = require('./gulp.config');
const shell = require('gulp-shell');

/**
 *$ gulp mocha
 *
 * description: runs unit tests
 * */
gulp.task('mocha', ['babel:test'], () => gulp.src([config.test.run], { read: false })
  .pipe(mocha({ reporter: 'spec', require: ['babel-core/register'] })));


gulp.task('mocha:coverage', ['babel'], shell.task('nyc mocha test/**/**'));
