const express = require("express");
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, function (res, req) {
  console.info("Server running on port " + PORT);
});