const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3001;

app.get("/", function (req, res) {
  console.log(`http://localhost:${port}/`);
  res.send("Server is running...");
});

app.listen(port);
