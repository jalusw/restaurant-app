const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/index.js"),
    // sw: path.resolve(__dirname, "src/scripts/sw.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public/"),
          to: path.resolve(__dirname, "dist/public"),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.woff(2)?$/i,
        type: "asset/inline",
      },
      {
        test: /\.svg$/i,
        type: "asset/inline",
      },
      {
        test: /\.(png|jpeg|jpg)$/i,
        type: "asset/resource",
        generator: {
          filename: "public/[name][ext]",
        },
      },
    ],
  },
};
