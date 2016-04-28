var webpack = require('webpack');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: false,
  entry: [
    path.resolve(__dirname, 'app/_window.js'),
    path.resolve(__dirname, 'app/main.jsx')
  ],
  output: {
    path: __dirname + '/share',
    publicPath: '/',
    filename: './share.js'
  },
  module: {
    loaders:[
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.js[x]?$/, loader: 'babel-loader' },
      { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=8192' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx','.css','.less'],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' }
    ]),
  ]
};
