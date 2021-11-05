const express = require("express");
const fs = require("fs");
const path = require("path");
const xmlParser = require("xml2json");
const bodyParser = require("body-parser");
const compression = require("compression");





const app = express();

const PORT = process.env.PORT || 80;

var file_tree = [];





app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, "frontend")));





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





// Sends the appropriate file to the client whatever the language value is
app.get("/conteudo/:language/:category/:page", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend", "conteudo", "index.html"));
});



// This api is used to get the file tree for the sidebar based on the language
app.post("/api/sidebar/:language", function (req, res) {
  var language = req.params.language;

  console.log("Request for /api/sidebar: /content/" + language);

  var lang_node = file_tree.language.find(function (element) {
    return element.title == language;
  });

  if (lang_node) {
    res.send(lang_node);
  } else {
    res.statusCode = 404;
    res.send({ error: true, description: "Language not found" });
  }
});



// This api gets the html file based on the language, category and page names
app.get("/api/content/:language/:category/:page", function (req, res) {
  var html_path = "/content/" + req.params.language + "/" + req.params.category + "/" + req.params.page + ".html";

  console.log("Request for /api/content: " + html_path);

  // Checking if the file exists in the folder frontend
  if (fs.existsSync(path.join(__dirname, "frontend", html_path))) {
    res.sendFile(path.join(__dirname, "frontend", html_path));
  } else {
    res.statusCode = 404;
    res.send({ error: true, description: "File not found" });
  } 
});



// Matches every other request and uses the 404 page
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend", "404", "index.html"));
});
