const path = require('path');

module.exports = [
  {
    entry: path.resolve(__dirname + '/src/pixi/Pixi.js'),
    mode: "development",
    devtool: "source-map",
    output: {
      filename: 'pixi.js',
      path: path.resolve(__dirname, 'build'),
      library: 'Pixi',
      libraryExport: 'default'
    },
  },
  {
    entry: path.resolve(__dirname + '/src/pixi/Pixi.js'),
    mode: "production",
    devtool: "source-map",
    output: {
      filename: 'pixi.min.js',
      path: path.resolve(__dirname, 'build'),
      library: 'Pixi',
      libraryExport: 'default'
    },
  }
]
