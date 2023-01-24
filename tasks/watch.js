const gulp = require('gulp');
const config = require('./gulp.config');
/**
 * $ gulp watch
 * description: Watches change in working files
 */
gulp.task('watch', () => {
  gulp.watch(config.js.src, ['server']);
  gulp.watch(config.test.src, ['mocha']);
  gulp.watch(config.config.src, ['babel:config']);
});

gulp.task('watch:mocha', () => {
  gulp.watch([config.js.src, config.test.src, `${config.taskRoot}/mocha.js`], ['mocha']);
});

gulp.task('watch:mocha:coverage', () => {
  gulp.watch([config.js.src, config.test.src], ['mocha:coverage']);
});
