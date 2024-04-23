const bcrypt = require("bcrypt");
const connection = require("../config/ConnectDB.js");
const moment = require("moment");
const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("./JwtServices.js");
const RandomID = require("../config/randomID.js");

//Tạo tài khoản
const createUser = (newUser) => {
  return new Promise((resolve, reject) => {
    const { email, password } = newUser;
    const id = RandomID(25);
    try {
      const hashPassword = bcrypt.hashSync(password, 10);
      const sql = "INSERT INTO users (id,email, password ) VALUES (?, ? , ?)";
      const createUser = connection.query(
        sql,
        [id, email, hashPassword],
        (err, data) => {
          resolve({
            status: "OK",
            message: "Tạo tài khoản thành công",
            data: createUser.values,
          });
        }
      );
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const loginUser = (loginUser) => {
  return new Promise((resolve, reject) => {
    const { email, password } = loginUser;
    try {
      const sql = "SELECT * FROM users WHERE email = ?";
      const checkUser = connection.query(sql, [email], async (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        if (data.length === 0) {
          resolve({
            status: "Err",
            message: "The email is not defined",
          });
        } else {
          const comparePassword = bcrypt.compareSync(
            password,
            data[0].password
          );
          if (comparePassword) {
            const access_token = await genneralAccessToken({
              id: data[0].id,
              isAdmin: data[0].isAdmin,
            });
            const refresh_token = await genneralRefreshToken({
              id: data[0].id,
              isAdmin: data[0].isAdmin,
            });

            resolve({
              status: "OK",
              message: "Login success",
              access_token,
              refresh_token,
            });
          } else {
            resolve({
              status: "Err",
              message: "The password is incorect",
              data: null,
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "DELETE FROM users WHERE id = ?";
      const checkUser = connection.query(sql, [userId], async (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        } else {
          resolve({
            status: "OK",
            message: "Delete user success",
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

//Lấy thông tin người dùng
const getAllUser = () => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM users";
      connection.query(sql, (err, data) => {
        resolve({
          status: 200,
          message: "Get all user",
          data: data,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

//Lấy thông tin chi tiết người dùng
const getDetailUser = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM users WHERE id = ?";
      connection.query(sql, [userId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        if (data.length === 0) {
          resolve({
            status: "OK",
            message: "The user is not defined",
          });
        } else {
          resolve({
            status: 200,
            message: "Get detail user",
            data: data,
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const updateUser = (infoUser, userId) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(infoUser);
      const { name, phone, address, avatar, isAdmin } = infoUser;
      const timeUpdate = moment().format("YYYY-MM-DD HH:mm:ss");
      const sql =
        "UPDATE users SET name = ? , phone = ? , address = ? , avatar = ? , isAdmin = ? , updated_at = ? WHERE id = ? ";
      connection.query(
        sql,
        [name, phone, address, avatar, isAdmin, timeUpdate, userId],
        (err, data) => {
          if (err) {
            console.log(err);
            resolve({
              status: 200,
              message: "Update user fail",
              data: data,
            });
          }
          resolve({
            status: 200,
            message: "Cập nhật thông tin thành công",
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

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  updateUser,
};
