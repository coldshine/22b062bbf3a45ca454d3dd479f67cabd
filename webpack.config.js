const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement',
      template: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'assets')
  }
};