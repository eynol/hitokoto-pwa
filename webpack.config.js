var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',

  entry: {
    vendor: [
      "react",
      "react-dom",
      'react-router',
      'react-router-dom',
      'rc-queue-anim',
      'dexie',
      'crypto-js/sha1',
      'react-textarea-autosize',
      'redux',
      'react-redux',
      'whatwg-fetch'
    ],
    bundle: __dirname + "/app/main.js"
  },
  output: {
    path: __dirname + "/build",
    filename: "[name].js"
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json"
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }, {
        test: /\.css$/,
        loader: 'style!css?modules!postcss'
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },

  postcss: [require('autoprefixer')],

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'runtime']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  devServer: {
    colors: true,
    historyApiFallback: true,
    port: process.env.PORT || 8080,
    inline: true,
    hot: true,
    proxy: {
      "/api/**": "http://127.0.0.1:9999/"
    }
  }
}
