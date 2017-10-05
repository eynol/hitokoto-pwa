var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
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
    publicPath: '/'
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
              sourceMap: true
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
    // new ExtractTextPlugin("[name]-[chunkhash].css"),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
