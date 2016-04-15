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
    extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
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
      test: /\.ts(x)?$/,
      exclude: '/node_modules/',
      loaders: ['babel-loader', 'ts-loader'],
    }],
  },
};
