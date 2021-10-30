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
          fs.readFileSync("./codinStruct-content/C/estrutura.xml"),
          {
            arrayNotation: ["language", "category", "page"],
            object: true,
          }
        );

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





// Sends the appropriate file to the client whatever the ling value is
app.get("/linguagem/:ling", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend", "linguagem", "index.html"));
});

// This request comes with the language title and if the language title matches the title method of any element of file_tree.language, return that element.
app.post("/content", function (req, res) {
  var ling = req.body.ling;

  console.log("Request for /content/" + ling);

  var lang_node = file_tree.language.find(function (element) {
    return element.title == ling;
  });

  if (lang_node) {
    res.send(lang_node);
  } else {
    res.send({ error: true });
  }
});