const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, options) => {
  let config = {
    entry: {
      data: './src/data.js',
      app: './src/index.js'
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
        template: './src/html/index.html'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'build')
    }
  };
  if (options.mode !== 'production') {
    config.devtool = 'inline-source-map';
    config.devServer = {
      hot: true
    };
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  return config
};