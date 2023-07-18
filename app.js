const express = require("express");
const xmlParser = require("xml2json");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const compression = require("compression");

const app = express();

let file_tree = [];

file_tree = xmlParser.toJson(
  fs.readFileSync("codinStruct-content/estrutura.xml"),
  {
    arrayNotation: ["language", "category", "page"],
    object: true,
  }
).main;

// Setting up file_tree to be available to the routes
app.use(function (req, res, next) {
  res.locals.file_tree = file_tree;
  next();
});

app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, "frontend")));

// Using the routes
app.use("/api", require("./routes/api"));
app.use("/", require("./routes/routes"));

module.exports = app;