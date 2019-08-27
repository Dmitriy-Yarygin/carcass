const Path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require('../config')();

const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = {
  entry: {
    app: [Path.resolve(__dirname, "../client/index.js")]
  },
  output: {
    path: config.path.build,
    filename: 'js/[name].[contenthash].js',
    publicPath: ASSET_PATH
  },

  plugins: [
    new CleanWebpackPlugin({ verbose: true, cleanOnceBeforeBuildPatterns: ['**/*']}),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, "../client/index.html"),
      title: 'Caching'
    })
  ],
  resolve: {
    alias: {
      "~": Path.resolve(__dirname, "../client")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        }
      }
    ]
  }
};
