const connection = require("../config/ConnectDB.js");

const checkExist = (table, field) => {
  return (req, res, next) => {
    connection.query(
      `SELECT * FROM ${table} WHERE ${field} = ?`,
      [req.body[`${field}`]],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: "error",
            message: "Internal server error",
          });
        }

        if (data.length > 0) {
          return res.status(400).json({
            status: "error",
            message: `${field} already exists`,
          });
        }

        next();
      }
    );
  };
};

module.exports = checkExist;
