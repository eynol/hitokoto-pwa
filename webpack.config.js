var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackPwaManifest = require('webpack-pwa-manifest')
var OfflinePlugin = require('offline-plugin');
var publicPath = process.env.PUBLIC_URL
var path = require('path');
module.exports = {
  devtool: 'cheap-module-source-map',

  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    //
    'react-hot-loader/patch',
    //
    'webpack/hot/only-dev-server',
    // activate HMR for React

    path.resolve(__dirname, "./app/main.dev.js")
  ],
  output: {
    path: path.resolve(__dirname, "/build"),
    filename: "[name].js",
    publicPath: publicPath || '/'
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
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              sourceMap: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
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
  devServer: {
    historyApiFallback: true,
    port: process.env.PORT || 8080,
    inline: true,
    hot: true,
    proxy: {
      "/api/**": "http://127.0.0.1:9999/",
      "/cors/**": "http://127.0.0.1:9999/"
    }
  },
  plugins: [
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
      publicPath: '/',
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
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [require('autoprefixer')];
        }
      }
    }),

    // new ExtractTextPlugin("[name]-[chunkhash].css"),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new OfflinePlugin({
      publicPath: publicPath || '/',
      updateStrategy: 'changed',
      autoUpdate: 1000 * 60 * 2,
      ServiceWorker: {
        events: true,
        navigateFallbackURL: publicPath ||'/'
      }
    })
  ]
}
