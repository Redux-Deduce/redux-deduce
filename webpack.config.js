const webpack = require('webpack');
const path = require('path');
const libraryName = 'dedux';
const outputFile = libraryName + '.js'

let config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  }
}

module.exports = config;