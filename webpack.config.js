var path = require('path');
var context = path.join(__dirname, 'public');

module.exports = {
  context: context,
  entry: '../src/entry.ls',
  output: {
    path: path.join(context, 'assets'),
    publicPath: 'assets/',
    filename: 'bundle.js'
  },
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
