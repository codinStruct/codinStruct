const express = require("express");
const path = require("path");
const router = express.Router();

// This is used to get the file tree for the sidebar based on the language
router.get("/sidebar/:language", function (req, res) {
  let language = req.params.language.toLowerCase();

  console.log("Request for /api/sidebar: /content/" + language);

  let lang_node = file_tree.language.find(function (element) {
    return element.path == language;
  });

  if (lang_node) {
    res.send(lang_node);
  } else {
    res.statusCode = 404;
    res.send({ error: true, description: "Language not found" });
  }
});

// This gets the html file based on the language, category and page names
router.get("/content/:language/:category/:page", function (req, res) {
  let html_path =
    "/content/" +
    req.params.language.toLowerCase() +
    "/" +
    req.params.category.toLowerCase() +
    "/" +
    req.params.page.toLowerCase() +
    ".html";

  console.log("Request for /api/content: " + html_path);

  // Checking if the file exists
  if (fs.existsSync(path.join(__dirname, "..", "frontend", html_path))) {
    res.sendFile(path.join(__dirname, "..", "frontend", html_path));
  } else {
    res.statusCode = 404;
    res.send({ error: true, description: "File not found" });
  }
});

module.exports = router;
