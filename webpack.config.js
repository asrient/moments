const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    moments:"./index.js",
},
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test:/\.(s*)css$/,
        use: ["style-loader", "css-loader",'sass-loader']
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: "H:\\AA\\pine\\app\\data\\apps\\moments\\source",
    publicPath: "/",
    filename: "[name].js"
  },
 // plugins: [new webpack.HotModuleReplacementPlugin()]
};