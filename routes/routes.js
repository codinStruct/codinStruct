const express = require("express")
const path = require("path");
const router = express.Router();

// Sends the appropriate file to the client whatever the values are
router.get("/conteudo/:language/:category/:page", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "conteudo", "index.html"));
});

// Matches every other request and uses the 404 page
router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "404", "index.html"));
});

module.exports = router;