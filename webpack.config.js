require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './client/src/index.jsx'),
  output: {
    path: path.join(__dirname, './client/dist'),
    filename: 'bundle.js',
  },
  target: ['web', 'es2017'],
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /.(jpe?g|png|gif|svg)$/i,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        RESEND_API_KEY: JSON.stringify(process.env.RESEND_API_KEY),
        SERVICE_ID: JSON.stringify(process.env.SERVICE_ID),
        TEMPLATE_ID: JSON.stringify(process.env.TEMPLATE_ID),
        EMAILJS_PUBLIC_KEY: JSON.stringify(process.env.EMAILJS_PUBLIC_KEY),
        PREVIEW_TEMPLATE_ID: JSON.stringify(process.env.PREVIEW_TEMPLATE_ID),
        // OPEN_AI_APIKEY: JSON.stringify(process.env.OPEN_AI_APIKEY),
      },
    }),
  ],
};
