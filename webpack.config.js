var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var context = __dirname;

module.exports = {
  context: context,
  entry: [
    'font-awesome/less/font-awesome.less',
    './src/style/main.less',
    './src/script/app.ls'
  ],
  output: {
    path: path.join(context, 'dist'),
    filename: 'bundle-[hash].js'
  },
  plugins: [
  	new HtmlWebpackPlugin({
  		template: './src/assets/index.html'
  	})
  ],
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  module: {
    loaders: [
      { test: /\.ls$/, loader: 'livescript' },
      { test: /\.jsx$/, loader: 'jsx?harmony' },
      { test: /\.(otf|woff2?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
      { test: /\.(jpg|png)$/, loader: 'file' },
      { test: /\.less$/, loader: 'style!css?sourceMap!autoprefixer?browsers=last 2 version!less?sourceMap=true' }
    ]
  }
};
