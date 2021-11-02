const express = require("express");
const fs = require("fs");
const spawn = require("child_process").spawn;
const path = require("path");
const xmlParser = require("xml2json");
const bodyParser = require("body-parser");





const app = express();

var file_tree = [];





app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "frontend")));





app.listen(3000, function () {
  console.info("Server running on port 3000");

  // Running content_md2html.sh
  console.log("Running content_md2html.sh");
  const content_md2html = spawn("sh", ["content_md2html.sh"])
    .on("close", function (code) {
      // The converter successfully ran
      if (code == 0) {
        file_tree = xmlParser.toJson(
          fs.readFileSync("codinStruct-content/estrutura.xml"),
          {
            arrayNotation: ["language", "category", "page"],
            object: true,
          }
        ).main;

        console.log("File tree: ");
        console.log(file_tree);
      }

      console.log("content_md2html.sh exited with code " + code);
    })
    .on("error", function (err) {
      console.error("content_md2html.sh error: " + err);

      throw err;
    });




    
  // Running sass_preprocess.sh
  console.log("Running sass_preprocess.sh");
  const sass_preprocess = spawn("sh", ["sass_preprocess.sh"])
    .on("close", function (code) {
      console.log("sass_preprocess.sh exited with code " + code);
    })
    .on("error", function (err) {
      console.error("sass_preprocess.sh error: " + err);

      throw err;
    });
});





// Sends the appropriate file to the client whatever the lang value is
app.get("/conteudo/:lang/:category/:page", function (req, res) {
  // Work around for files like main.js and style.css
  if (req.params.lang.includes("."))
    res.sendFile(path.join(__dirname, "frontend", req.params.lang));

  res.sendFile(path.join(__dirname, "frontend", "conteudo", "index.html"));
});

// This api is used to get the file tree for the sidebar based on the language
app.post("/api/sidebar/:lang", function (req, res) {
  var lang = req.params.lang;

  console.log("Request for /api/sidebar: /content/" + lang);

  var lang_node = file_tree.language.find(function (element) {
    return element.title == lang;
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