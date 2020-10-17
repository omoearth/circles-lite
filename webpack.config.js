const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = {
  entry: {
    bundle: ['./main.ts'],
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.tsx', '.ts', '.js', '.svelte', '.svx'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: __dirname + '/dist/webpack',
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /.(svelte|html|svx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
            preprocess: require('./svelte.config.js').preprocess,
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        }),
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new ExtractTextPlugin('bundle.css', {
      disable: process.env.NODE_ENV === 'development',
    })
    // new BundleAnalyzerPlugin()
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  devtool: prod ? false : 'source-map',
  devServer: {
    compress: true,
    disableHostCheck: true,
    contentBase: [path.join(__dirname, 'dist'),path.join(__dirname, 'dapps')],
    port: 5000
 }   
}