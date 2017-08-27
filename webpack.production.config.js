var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
    filename: "[name]-[hash].js"
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
        loader: ExtractTextPlugin.extract('style', 'css?modules!postcss')
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'production'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'runtime']
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("[name]-[hash].css")
  ]
}
console.log(JSON.stringify(process.env.NODE_ENV))