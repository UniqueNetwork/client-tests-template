const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app.js'),
  target: 'web',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    chunkFormat: 'array-push',

    library: {
      name: 'app',
      type: 'var',
    }
  },
  optimization: {
    minimize: true
  }
};
