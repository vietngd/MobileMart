const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const db_name = process.env.DB_NAME;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: db_name,
});

module.exports = connection;
