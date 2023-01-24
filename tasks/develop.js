/* eslint-disable no-unused-vars */

const gulp = require('gulp');
const { spawn } = require('child_process');
const config = require('./gulp.config');

const debug = require('debug')('darwin:gulp:dev');

let node;

/**
 * $ gulp config
 * description: Copy config directory to dist directory
 */
gulp.task('config', ['clean:config'], () => gulp.src(`${config.config.src}.json`)
  .pipe(gulp.dest(config.config.dist)));
gulp.task('copy:yml', ['clean:config'], () => gulp.src('src/**/*.yml')
  .pipe(gulp.dest(config.js.dist)));


/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', ['babel'], () => {
  if (node) node.kill();
  // clone the actual env vars to avoid overrides
  const env = Object.create(process.env);
  if (!env.NODE_CONFIG_DIR) {
    env.NODE_CONFIG_DIR = './dist/config/';
  }
  node = spawn('node', ['dist/server.js'], { stdio: 'inherit', env });
  node.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});


/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', ['babel', 'watch', 'server']);


// exit process without being obliged to ctrl+c to exit
gulp.doneCallback = function (err) {
  // if we are in pipelines environment then exit whit code 1 if err or 0 if step finished
  if (process.env.BITBUCKET_COMMIT) {
    process.exit(err ? 1 : 0);
  }
};
// process.on('unhandledRejection', r => console.log(r));
// clean up if an error goes unhandled.
process.on('exit', () => {
  if (node) node.kill();
});
