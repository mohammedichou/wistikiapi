var path = require('path');

const paths = {
  js: {
    srcFolder: 'src/**',
    src: 'src/**/*.js',
    dist: 'dist/',
  },
  test: {
    src: 'test/**/*.js',
    dist: 'test-dist/',
    run: 'test-dist/**/*.js',
    coverage: 'coverage/',
  },
  config: {
    src: 'src/config/**/*',
    dist: 'dist/config',
  },
  locales: {
    src: 'src/locales/**.json',
    dist: 'dist/locales',
  },
  // Must be absolute or relative to source map
  sourceRoot: path.resolve('src'),
  testRoot: path.resolve('test'),
  configRoot: path.resolve('src/config'),
  taskRoot: path.resolve('tasks'),
};

module.exports = paths;
