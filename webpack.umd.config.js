'use strict';

const path = require('path');
const glob = require('glob'); //自动查找固定目录的js文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清理文件夹
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const node_lib = process.env.NODE_LIB === 'production';
const outputPath = 'dist';
const entryPath = 'src';
const clearPaths = ['dist/lib/**.js', 'dist/lib/**.js.map'];
const pathMatch = node_lib ? '**/index.js' : '**/**.js';

//require('babel-polyfill');

let webpackConfig = {
  entry: {
    //vendor: 'babel-polyfill'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, outputPath),
    //library: 'qview',
    libraryTarget: 'umd'
  },
  context: path.resolve(__dirname),
  resolve: {
  },
  devtool: 'source-map',
  plugins: [
    // new UglifyJsPlugin({
    //   sourceMap: true
    // })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: path.join(__dirname, entryPath),
        exclude: /(node_modules|dist|docs|examples|tutorials)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
}

let pathRoot = path.resolve(__dirname, './')
let paths = path.resolve(pathRoot, entryPath);
let options = {
  cwd: paths, // 在src目录里找
  sync: true, // 这里不能异步，只能同步
};

let entries = new glob.Glob(pathMatch, options).found;

entries.forEach((page) => {
  let filename = page.substring(0, page.lastIndexOf('.'));
  if (filename.indexOf('index') > -1) {
    filename = filename.substring(0, filename.lastIndexOf('/'));
    filename = node_lib ? `lib/${filename}` : `${filename}/${filename}`;
  }
  webpackConfig.entry[filename] = path.resolve(paths, page);
  webpackConfig.plugins.push(new CleanWebpackPlugin(
    clearPaths,
    {
      root: __dirname,    //根目录
      exclude: ['dist/vendor.js', 'dist/vendor.js.map'],  //排除
      verbose: true,      //开启在控制台输出信息
      dry: false        　//启用删除文件
    }
  ));
});

module.exports = webpackConfig;