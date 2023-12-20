const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry:  './src/index.js',
  output: {
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    })
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 9000,
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options:{
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }
        }
      },
    ],
  },
};