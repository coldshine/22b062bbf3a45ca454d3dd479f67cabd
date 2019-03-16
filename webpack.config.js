const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, options) => {
  let config = {
    entry: {
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
        template: 'index.html'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'assets')
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