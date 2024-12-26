const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: { app: './src/app.js', form: "./src/storage.js" },
  output: {
    filename: '[name].js',
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
      chunks: ['app'],
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'app.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/form.html',
      chunks: ['form'],
      inject: 'head',
      scriptLoading: 'blocking',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [{
      test: /\.(jpg|png|svg)$/,
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
