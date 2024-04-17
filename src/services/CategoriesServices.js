const bcrypt = require("bcrypt");
const connection = require("../config/ConnectDB.js");
const RandomID = require("../config/randomID.js");
const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("./JwtServices.js");

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
    try {
      const sql =
        "UPDATE categories SET name = ? , description = ? WHERE id = ? ";
      connection.query(sql, [name, description, categoryId], (err, data) => {
        if (err) {
          console.log(err);
        }
        resolve({
          status: 200,
          message: "Update category success",
          data: data,
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

const GetAllCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM categories ";
      connection.query(sql, (err, data) => {
        if (err) {
          console.log(err);
        }
        resolve({
          status: 200,
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

module.exports = {
  createCategory,
  UpdateCategory,
  DeleteCategory,
  GetAllCategory,
};
