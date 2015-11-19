// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: './src/client.js',
  output: {
    filename: './public/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ];
} else {
  module.exports.devtool = '#source-map';
}
