const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

// Object entries has keys which are the name of the file and the value is the path to the file
const entries = {};
fs.readdirSync("./webpack").forEach((file) => {
  entries[file.replace(".js", "")] = path.resolve(__dirname, "webpack", file);
});

module.exports = {
  entry: entries,
  mode: "development",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "frontend", "webpack"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
