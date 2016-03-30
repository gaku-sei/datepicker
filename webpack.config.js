'use strict';

const path = require('path');
const webpack = require('webpack');

const paths = {
  entry: [
    'babel-polyfill',
    './src/index',
  ],
  js: path.join(__dirname, 'app'),
};

module.exports = {
  entry: paths.entry,
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: paths.js,
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: paths.js,
  },
  module: {
    loaders: [{
      test: /\.js(x)?$/,
      exclude: '/node_modules/',
      loader: 'babel-loader',
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }],
  },
};
