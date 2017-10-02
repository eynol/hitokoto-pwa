var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: {
    vendor: [
      "react",
      "react-dom",
      'react-router',
      'react-router-dom',
      'react-redux',
      'redux',
      'rc-queue-anim',
      'dexie',
      'crypto-js/sha1',
      'react-textarea-autosize',
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
                modules: true,
                sourceMap: true
              }
            },
            'postcss-loader'
          ]
        })
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: 'file-loader?limit=1024&name=fonts/[name].[ext]'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: "file-loader?limit=1024&name=fonts/[name].[ext]"
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    port: process.env.PORT || 8080,
    inline: true,
    hot: true,
    proxy: {
      "/api/**": "http://127.0.0.1:9999/"
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [require('autoprefixer')];
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: [
        'vendor', 'manifest'
      ],
      minChunks: Infinity
    }),
    new ExtractTextPlugin("[name]-[chunkhash].css"),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
