const bcrypt = require("bcrypt");
const connection = require("../config/ConnectDB.js");
const moment = require("moment");
const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("./JwtServices.js");
const RandomID = require("../config/randomID.js");
const EmailServices = require("../services/EmailServices.js");
const ultils = require("../ultils.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//Tạo tài khoản
const createUser = (newUser) => {
  return new Promise((resolve, reject) => {
    const { email, password } = newUser;
    const id = RandomID(25);
    try {
      const hashPassword = bcrypt.hashSync(password, 10);
      const sql = "INSERT INTO users (id,email, password ) VALUES (?, ? , ?)";
      connection.query(sql, [id, email, hashPassword], (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "Tạo tài khoản thất bại",
          });
        } else {
          resolve({
            status: "OK",
            message: "Tạo tài khoản thành công",
          });
        }
      });
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
          console.log("Err :", err);
          reject(err);
          return;
        }

        if (data.length === 0) {
          resolve({
            status: "Err",
            message: "Sai tài khoản hoặc mật khẩu",
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
      let sql = "UPDATE users SET ";
      let values = [];

      Object.keys(infoUser).forEach((key, index) => {
        if (index > 0) {
          sql += ", ";
        }

        sql += `${key} = ?`;
        values.push(infoUser[key]);
      });
      sql += ` WHERE id = ?`;
      values.push(userId);

      connection.query(sql, values, (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "Update user fail",
            data: data,
          });
        }
        resolve({
          status: "OK",
          message: "Cập nhật thông tin thành công",
          data: data,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

//Gửi yêu cầu reset password
const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT id FROM users WHERE email = ?";
      connection.query(sql, [email], (err, data) => {
        if (err) {
          resolve({
            status: "Err",
            message: "Err khi forgot password",
          });
        } else {
          if (data.length > 0) {
            const code = ultils.RandomCode();
            const codeJwt = ultils.genneralCodeJWT(code);
            EmailServices.sendEmail(email, code);
            resolve({
              status: "OK",
              message: "Send email success",
              code: codeJwt,
            });
          } else {
            resolve({
              status: "Err",
              message: "Email không tồn tại",
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
const verifyForgotPassword = (code, token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.VERIFY_KEY, function (err, codeJWT) {
        if (err) {
          console.log("Token err==>>>", err);
          resolve({
            status: "Err",
            message: "The code is incorect",
          });
        }
        if (codeJWT?.code === code) {
          resolve({
            status: "OK",
            message: "Xác minh thành công",
          });
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const updatePassword = (newPassword, email) => {
  return new Promise((resolve, reject) => {
    try {
      const hashPassword = bcrypt.hashSync(newPassword, 10);
      connection.query(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashPassword, email],
        (err) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Update password",
            });
          } else {
            resolve({
              status: "OK",
              message: "Update password success",
            });
          }
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
  forgotPassword,
  verifyForgotPassword,
  updatePassword,
};
