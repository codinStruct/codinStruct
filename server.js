const express = require("express");
const fs = require("fs");
const path = require("path");
const xmlParser = require("xml2json");
const bodyParser = require("body-parser");
const compression = require("compression");

const app = express();

const PORT = process.env.PORT || 3000;

let file_tree = [];

app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, "frontend")));

app.use("/api", require("./routes/api"));
app.use("/", require("./routes/routes"));

app.listen(PORT, function () {
  console.info("Server running on port " + PORT);

  file_tree = xmlParser.toJson(
    fs.readFileSync("codinStruct-content/estrutura.xml"),
    {
      arrayNotation: ["language", "category", "page"],
      object: true,
    }
  ).main;

  console.log("File tree: ");
  console.log(file_tree);
});
