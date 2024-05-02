const bcrypt = require("bcrypt");
const connection = require("../config/ConnectDB.js");
const RandomID = require("../config/randomID.js");
const moment = require("moment");

const createCategory = (newCategory) => {
  return new Promise((resolve, reject) => {
    const { name, description } = newCategory;
    const id = RandomID(25);
    try {
      const sql =
        "INSERT INTO categories (id,name,description) VALUES (?, ? , ?)";
      connection.query(sql, [id, name, description], (err, data) => {
        if (err) {
          console.log(err);
        }
        resolve({
          status: 200,
          message: "Thêm danh mục thành công",
          data: data,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const UpdateCategory = (newCategory, categoryId) => {
  return new Promise((resolve, reject) => {
    const { name, description } = newCategory;
    const timeUpdate = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const sql =
        "UPDATE categories SET name = ? , description = ? , updated_at = ? WHERE id = ? ";
      connection.query(
        sql,
        [name, description, timeUpdate, categoryId],
        (err, data) => {
          if (err) {
            console.log(err);
            resolve({
              status: 200,
              message: "Update category fail",
              err,
            });
          }
          resolve({
            status: 200,
            message: "Update category success",
            data: data,
          });
        }
      );
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
          console.log(err);
        }
        resolve({
          status: 200,
          message: "Delete category success",
          data: data,
        });
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
