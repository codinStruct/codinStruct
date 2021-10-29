// simple express server running on port 3000 and serving the public folder

const express = require("express");
const app = express();
const spawn = require("child_process").spawn;
const path = require("path");

app.use(express.static(path.join(__dirname, "frontend")));

app.listen(3000, function () {
  console.log("Server running on port 3000");

  // Running content_md2html.sh
  console.log("Running content_md2html.sh");
  const content_md2html = spawn("sh", ["content_md2html.sh"])
    .on("close", function (code) {
      console.log("content_md2html.sh exited with code " + code);
    })
    .on("error", function (err) {
      console.log("content_md2html.sh error: " + err);
    });

  // Running sass_preprocess.sh
  console.log("Running sass_preprocess.sh");
  const sass_preprocess = spawn("sh", ["sass_preprocess.sh"])
    .on("close", function (code) {
      console.log("sass_preprocess.sh exited with code " + code);
    })
    .on("error", function (err) {
      console.log("sass_preprocess.sh error: " + err);
    });
});
