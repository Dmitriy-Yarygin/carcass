const Webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  bail: true,
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',

  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        react: { test: /[\\/]node_modules[\\/]((react).*)[\\/]/, name: "react", chunks: "all" },
        vendor: { test: /[\\/]node_modules[\\/]((?!react).*)[\\/]/, name: 'vendors', chunks: 'all' }
      }
    }
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    }),
    new CompressionPlugin({
      test: /\.(js|css|html)$/,
      threshold: 8192
    }),
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
});
