var gulp      = require('gulp'),
  gConfig     = require('../gulp-config'),
  utils       = require('./utils'),
  opts        = gConfig.pluginOpts,
  env         = utils.getEnv(),
  src         = gConfig.paths.sources,
  dest        = gConfig.paths.destinations,
  plugins     = require('gulp-load-plugins')(opts.load),
  /* scripts:lint */
  lint = function() {
    return gulp.src(src.scripts)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format());
  },
  /* scripts:compile */
  compile = function() {
    return gulp.src(src.scripts)
      .pipe(plugins.plumber())
      .pipe(plugins.babel(opts.babel))
      .pipe(gulp.dest(dest.js));
  },
  /* scripts:watch */
  watch = function() {
    gulp.watch(src.scripts, ['scripts:compile']);
  };

module.exports = {
  lint   : lint,
  compile: compile,
  watch  : watch
};
