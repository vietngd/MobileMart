const connection = require("../config/ConnectDB.js");
const RandomID = require("../config/randomID.js");
const moment = require("moment");

const createCategory = (newCategory) => {
  return new Promise((resolve, reject) => {
    const { name } = newCategory;
    const id = RandomID(25);
    try {
      const sql = "INSERT INTO categories (id,name) VALUES (?, ?)";
      connection.query(sql, [id, name], (err, data) => {
        if (err) {
          console.log("Lỗi khi tạo danh mục", err);
          resolve({
            status: "Err",
            message: "Thêm danh mục fail",
          });
        } else {
          resolve({
            status: "OK",
            message: "Thêm danh mục thành công",
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const UpdateCategory = (newCategory, categoryId) => {
  return new Promise((resolve, reject) => {
    const timeUpdate = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const sql = "UPDATE categories SET name = ? WHERE id = ? ";
      connection.query(sql, [newCategory, categoryId], (err) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "Update category fail",
            err,
          });
        }
        resolve({
          status: "OK",
          message: "Update category success",
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const DeleteCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "DELETE FROM categories WHERE id = ? ";
      connection.query(sql, [categoryId], (err, data) => {
        if (err) {
          console.log("Lỗi khi delete category", err);
          resolve({
            status: "Err",
            message: "Delete category fail",
          });
        } else {
          resolve({
            status: "OK",
            message: "Delete category success",
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const GetAllCategory = () => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM categories ";
      connection.query(sql, (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "Get all category Fail",
            err,
          });
        }
        resolve({
          status: "OK",
          message: "Get all category success",
          categories: data,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const GetCategoryById = (category_id) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM categories WHERE id = ?";
      connection.query(sql, [category_id], (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "Get category Fail",
            err,
          });
        }
        resolve({
          status: "OK",
          message: "Get category success",
          category: data,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

module.exports = {
  createCategory,
  UpdateCategory,
  DeleteCategory,
  GetAllCategory,
  GetCategoryById,
};
