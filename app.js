const express = require("express");
const path = require("path");
const urlController = require("./controllers/urlController");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/shorten", urlController.shortenUrl);

app.get("/:shortCode", urlController.redirectUrl);

module.exports = app;
