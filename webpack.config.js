module.exports = {
  entry: './src/tetris.js',
  output: {
    filename: 'bundle.js',
    path: './'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
