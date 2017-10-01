var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Visualizer = require('webpack-visualizer-plugin');

module.exports = {
  entry: {
    vender: [
      "react",
      "react-dom",
      'react-router',
      'react-router-dom',
      'redux',
      'react-redux',
      'rc-queue-anim',
      'dexie',
      'crypto-js/sha1',
      'react-textarea-autosize',
      'whatwg-fetch',
      'core-js/es6/promise',
      'core-js/es6/array',
      'core-js/es6/map',
      'core-js/es6/set'
    ],
    bundle: __dirname + "/app/main.js"
  },
  output: {
    path: __dirname + "/build",
    filename: "[name]-[chunkhash].js",
    chunkFilename: '[chunkhash].js'
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json-loader"
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true
              }
            },
            'postcss-loader'
          ]
        })
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [require('autoprefixer')];
        }
      }
    }),

    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"
    }),
    new ExtractTextPlugin("[name]-[chunkhash].css"),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    new webpack.HashedModuleIdsPlugin(),

    new Visualizer({filename: './statistics-production.html'})
  ]
}