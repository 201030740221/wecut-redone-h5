var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: './app',
    host: '192.168.2.38',
    port: 8002
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8002',
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
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: 'http://192.168.2.38:8002' })
  ]
};
