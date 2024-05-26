const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const db_name = process.env.DB_NAME;
const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWROD;

const connection = mysql.createConnection({
  host: db_host,
  user: db_user,
  password: db_password,
  database: db_name,
});

module.exports = connection;
