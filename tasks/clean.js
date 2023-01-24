const gulp = require('gulp');
const del = require('del');
const config = require('./gulp.config');
/**
 * $ gulp clean:config
 * description: cleans config directory in dist directory
 *
 * */
gulp.task('clean:config', () => del(config.config.dist));

/**
 * $ gulp clean:test
 * description: Cleans compiled test files
 * */
gulp.task('clean:test', () => del(config.test.dist));

/**
 * $ gulp clean:dist
 * description: cleans dist directory
 * */
gulp.task('clean:dist', [], () => del(['paths.js.dist', `!${config.config.dist}`]));

/**
 * $ gulp clean:coverage
 * description: cleans test coverage directory
 */
gulp.task('clean:coverage', () => del(config.test.coverage));

/**
 * $ gulp clean
 * description: Cleans all compiled files
 */
gulp.task('clean', ['clean:dist', 'clean:test', 'clean:coverage', 'clean:config']);
