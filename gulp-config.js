var env = 'public/',
  pkg   = require('./package.json');
module.exports = {
  pkg: {
    name: pkg.name
  },
  pluginOpts: {
    browserSync: {
      port   : 1987,
      server : {
        baseDir: env
      }
    },
    babel: {
      presets: [ 'es2015' ]
    },
    pug: {
      pretty: true,
      data  : {
        name       : pkg.name,
        description: pkg.description
      }
    },
    load: {
      rename: {
        'gulp-util'        : 'gUtil',
        'gulp-cssnano'     : 'minify',
        'gulp-autoprefixer': 'prefix'
      }
    },
    prefix: [
      'last 3 versions',
      'Blackberry 10',
      'Android 3',
      'Android 4'
    ],
    stylint: {
      reporter: 'stylint-stylish'
    },
    wrap: {
      markup: '<html><head><link rel="stylesheet" href="style.css"/></head><body><%= contents %><script src="script.js"></script></body></html>'
    }
  },
  paths: {
    base: env,
    sources: {
      markup   : 'src/**/*.jade',
      overwatch: env + '**/*.{html,js,css}',
      scripts  : 'src/**/*.js',
      styles   : 'src/**/*.styl'
    },
    destinations: {
      css : env,
      html: env,
      js  : env
    }
  }
};
