var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Visualizer = require('webpack-visualizer-plugin');
var WebpackPwaManifest = require('webpack-pwa-manifest')
var OfflinePlugin = require('offline-plugin');
var path = require('path');

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
    chunkFilename: '[chunkhash].js',
    publicPath: 'https://hitokoto.heitaov.cn/'
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
                minimize: true
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
        exclude: /app\/fonts/,
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
      template: __dirname + "/app/index.tmpl.html",
      favicon: __dirname + '/app/icon.png'
    }),
    new WebpackPwaManifest({
      name: '一言PWA',
      short_name: '一言PWA',
      description: '一个一言渐进式网页应用!',
      background_color: '#f6f6f6',
      theme_color: "#3a3a3a",
      publicPath: 'https://hitokoto.heitaov.cn/',
      ios: true,
      icons: [
        {
          src: path.resolve('app/icon.png'),
          sizes: [
            120, 152, 167, 180, 512
          ],
          destination: path.join('icons', 'ios'),
          ios: true
        },
        // {   src: path.resolve('src/assets/icons/ios-icon.png'),   size: 1024,
        // destination: path.join('icons', 'ios'),   ios: 'startup' },
        {
          src: path.resolve('app/icon.png'),
          sizes: [
            36,
            48,
            72,
            96,
            144,
            192,
            512
          ],
          destination: path.join('icons', 'android')
        }
      ]
    }),
    new ExtractTextPlugin("[name]-[chunkhash].css"),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vender', 'manifest']
    }),
    new webpack.HashedModuleIdsPlugin(),
    new OfflinePlugin({
      updateStrategy: 'changed',
      autoUpdate: 1000 * 60 * 10,
      ServiceWorker: {
        events: true,
        navigateFallbackURL: '/'
      }
    }),
    new Visualizer({filename: './statistics-production.html'})
  ]
}