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
            status: "Err",
            message: "Lỗi server vui lòng thử lại sau!",
          });
        }
        if (data.length > 0) {
          return res.status(200).json({
            status: "exists",
            message: `${field} đã tồn tại`,
          });
        }
        next();
      }
    );
  };
};

module.exports = checkExist;
