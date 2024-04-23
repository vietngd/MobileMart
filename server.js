const routes = require("./src/routes");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//Cau hinnh
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

//Cau hinh routes
routes(app);

const port = process.env.PORT || 3001;

app.get("/", function (req, res) {
  console.log(`http://localhost:${port}/`);
  res.send("Server is running...");
});

app.listen(port);
