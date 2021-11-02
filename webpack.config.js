const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("./webpack/*.js"),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "frontend", "vendor", "webpack"),
  },
};