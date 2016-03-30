'use strict';

const del = require('del');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config');

const paths = {
  app: {
    root: './app/',
    bundle: './app/bundle.js',
    view: './app/view.html',
  },
  src: {
    root: './src/',
    all: './src/**/*.{js,jsx}',
  },
  view: {
    target: `./views/${process.env.NODE_ENV || 'development'}.html`,
  },
};

gulp.task('clean', (done) => {
  del([paths.app.bundle, paths.app.view])
    .then(() => done());
});

gulp.task('copy', ['clean'], (done) =>
  gulp.src(paths.view.target)
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest(paths.app.root)));

gulp.task('server', ['clean'], (done) =>
  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
  }).listen(8080, 'localhost', (err) => {
    if (err) {
      plugins.util.log(err);
    }
    done();
  }));

gulp.task('compile', ['clean'], () =>
  gulp.src(paths.src.all)
    .pipe(webpackStream(webpackConfig)
      .on('error', function(error) {
        this.emit('end');
      }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.app.root)));

gulp.task('build', ['copy', 'compile']);

gulp.task('default', ['copy', 'server']);
