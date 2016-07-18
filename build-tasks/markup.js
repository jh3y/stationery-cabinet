var gulp      = require('gulp'),
  gConfig     = require('../gulp-config'),
  utils       = require('./utils'),
  opts        = gConfig.pluginOpts,
  env         = utils.getEnv(),
  src         = gConfig.paths.sources,
  dest        = gConfig.paths.destinations,
  plugins     = require('gulp-load-plugins')(opts.load),
  /* markup:lint */
  lint = function() {
    return gulp.src(src.markup)
      .pipe(plugins.pugLint());
  },
  /* markup:compile */
  compile = function() {
    /*
      Get list of pens here...
    */
    opts.pug.data.pens = ['a', 'b', 'c'];
    const i = plugins.filter(['**', '!src/index.*'], {restore: true});
    return gulp.src(src.markup)
      .pipe(plugins.plumber())
      .pipe(plugins.pug(opts.pug))
      .pipe(i)
      .pipe(plugins.wrap(opts.wrap.markup))
      .pipe(i.restore)
      .pipe(gulp.dest(dest.html));
  },
  /* markup:watch */
  watch = function() {
    gulp.watch(src.markup, ['markup:compile']);
  };

module.exports = {
  lint   : lint,
  compile: compile,
  watch  : watch
};
