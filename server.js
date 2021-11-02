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

  // Running webpack
  console.log("Running 'webpack'");
  spawn("npm", ["run", "webpack"])
    .on("close", function (code) {
      console.log("Exited 'webpack' with code " + code);
    })
    .on("error", function (err) {
      console.error("Error 'webpack': " + err);
    });

  // Running md2html
  console.log("Running 'md2html'");
  spawn("npm", ["run", "md2html"])
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

      console.log("Exited 'md2html' with code " + code);
    })
    .on("error", function (err) {
      console.error("Error 'md2html': " + err);

      throw err;
    });




    
  // Running sass_preprocess
  console.log("Running 'sass_preprocess'");
  spawn("npm", ["run", "sass_preprocess"])
    .on("close", function (code) {
      console.log("Exited 'sass_preprocess' with code " + code);
    })
    .on("error", function (err) {
      console.error("Error 'sass_preprocess': " + err);

      throw err;
    });
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