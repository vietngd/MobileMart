const { data } = require("jquery");
const connection = require("../config/ConnectDB.js");

const createSlider = (sliders) => {
  return new Promise((resolve, reject) => {
    try {
      const { images } = sliders;
      const sql = `INSERT INTO sliders (name, link) VALUES (?, ?)`;

      if (images && images.length > 0) {
        const promises = images.map((slider, index) => {
          return new Promise((resolve, reject) => {
            connection.query(
              sql,
              [`slider[${index + 1}]`, slider],
              (err, result) => {
                if (err) {
                  console.log("Lỗi khi tạo slider", err);
                  reject({
                    status: "Err",
                    message: "Tạo slider thất bại",
                  });
                } else {
                  resolve({
                    status: "Success",
                    message: "Tạo slider thành công",
                  });
                }
              }
            );
          });
        });

        // Sử dụng Promise.all để chờ tất cả các Promise trong mảng
        Promise.all(promises)
          .then((results) => {
            resolve({
              status: "OK",
              message: "Tạo tất cả sliders thành công",
              results,
            });
          })
          .catch((error) => {
            reject({
              status: "Err",
              message: "Tạo một hoặc nhiều sliders thất bại",
              error,
            });
          });
      } else {
        resolve({
          status: "Err",
          message: "Không có sliders để tạo",
        });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const getAllSlider = () => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT id,link from sliders`;

      connection.query(sql, [], (err, result) => {
        if (err) {
          console.log("Lỗi khi get slider", err);
          reject({
            status: "Err",
            message: "Get slider thất bại",
          });
        } else {
          resolve({
            status: "OK",
            message: "Get slider thành công",
            data: result,
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const deleteSlider = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `DELETE FROM sliders WHERE id = ?`;
      connection.query(sql, [id], (err, result) => {
        if (err) {
          console.log("Lỗi khi Delete slider", err);
          reject({
            status: "Err",
            message: "Delete slider thất bại",
          });
        } else {
          resolve({
            status: "OK",
            message: "Delete slider thành công",
            data: result,
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

module.exports = {
  createSlider,
  getAllSlider,
  deleteSlider,
};
