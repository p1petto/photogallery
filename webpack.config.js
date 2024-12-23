const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    server: 'https',
    static: {
      directory: path.join(__dirname, 'dist')
    },
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [{
      test:  /\.(jpg|png|svg)$/,
      type: 'asset/resource',
      exclude: /(node_modules)/,
      include: [path.resolve(__dirname, 'src')],
      generator: {
        filename: './images/[name][ext]'
      } 
    },
    {
      test: /\.html$/i,
      loader: "html-loader",
    },]
  }

}
