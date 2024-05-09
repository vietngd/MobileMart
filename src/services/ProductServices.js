const bcrypt = require("bcrypt");
const connection = require("../config/ConnectDB.js");
const RandomID = require("../config/randomID.js");
const moment = require("moment");

const createProduct = (newProduct) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      description,
      hot,
      price,
      sale,
      quantity,
      category_id,
      configuration,
      images,
    } = newProduct;

    const id = RandomID(25);
    try {
      const sqlProduct =
        "INSERT INTO products (id,name,images,description,hot,price,sale,quantity,category_id,configuration) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ?)";

      const imagesString = images.join(",");
      connection.query(
        sqlProduct,
        [
          id,
          name,
          imagesString,
          description,
          hot,
          price,
          sale,
          quantity,
          category_id,
          configuration,
        ],
        (err, data) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Thêm sản phẩm thất bại",
              err,
            });
          }

          resolve({
            status: "OK",
            message: "Thêm sản phẩm thành công",
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

const UpdateProduct = (newProduct, ProductId) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      description,
      hot,
      price,
      sale,
      quantity,
      category_id,
      configuration,
      images,
    } = newProduct;
    const timeUpdate = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const sql =
        "UPDATE products SET name = ? ,images = ? , description = ? , hot = ? , price = ? , sale= ? , quantity = ? ,category_id= ?, configuration= ?  , updated_at = ? WHERE id = ? ";

      const imagesString = images.join(",");
      connection.query(
        sql,
        [
          name,
          imagesString,
          description,
          hot,
          price,
          sale,
          quantity,
          category_id,
          configuration,
          timeUpdate,
          ProductId,
        ],
        (err, data) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Update Product fail",
              err,
            });
          }
          resolve({
            status: "OK",
            message: "Update Product success",
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

const DeleteProduct = (ProductId) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "DELETE FROM products WHERE id = ? ";
      connection.query(sql, [ProductId], (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: "Err",
            message: "Delete Product Fail",
            data: data,
          });
        }
        resolve({
          status: "OK",
          message: "Delete Product success",
          data: data,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const GetAllProduct = (page, pageSize, sortField, sortOrder, productName) => {
  return new Promise((resolve, reject) => {
    try {
      // Tính chỉ số bắt đầu và số lượng sản phẩm để trả về trên trang hiện tại
      const startIndex = (page - 1) * pageSize;

      let sql = "SELECT * FROM products WHERE 1=1";

      if (productName) {
        sql += ` AND name LIKE '%${productName}%'`;
      }
      // Xử lý sort
      if (sortField && sortOrder) {
        sql += ` ORDER BY ${sortField} ${sortOrder}`;
      }

      // Thêm phân trang
      sql += ` LIMIT ${startIndex}, ${pageSize}`;

      connection.query(sql, (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: 200,
            message: "Get all Product fail",
            err,
          });
        }

        // Tính tổng số sản phẩm
        connection.query(
          "SELECT COUNT(*) AS totalCount FROM products",
          (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            }

            const totalCount = result[0].totalCount;

            // Tạo đối tượng kết quả để trả về
            const response = {
              status: 200,
              message: "Get all Product success",
              data: data,
              pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
                totalCount: totalCount,
              },
            };

            resolve(response);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const GetByIdProduct = (ProductId) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM products WHERE id = ? ";
      connection.query(sql, [ProductId], (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: 200,
            message: "Get detail product fail",
            err,
          });
        }
        resolve({
          status: 200,
          message: "Get detail product success",
          data,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const GetByCategory = (categoryId, page, pageSize, sortField, sortOrder) => {
  return new Promise((resolve, reject) => {
    try {
      // Tính chỉ số bắt đầu và số lượng sản phẩm để trả về trên trang hiện tại
      const startIndex = (page - 1) * pageSize;

      let sql = `SELECT * FROM products WHERE category_id = ?`;

      // Xử lý sort
      if (sortField && sortOrder) {
        sql += ` ORDER BY ${sortField} ${sortOrder}`;
      }

      if (pageSize) {
        // Thêm phân trang
        sql += ` LIMIT ${startIndex}, ${pageSize}`;
      }

      connection.query(sql, [categoryId], (err, data) => {
        if (err) {
          console.log(err);
          resolve({
            status: 200,
            message: "Get Product by category fail",
            err,
          });
        }

        // Tính tổng số sản phẩm
        connection.query(
          "SELECT COUNT(*) AS totalCount FROM products WHERE category_id = ?",
          [categoryId],
          (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            }

            const totalCount = result[0].totalCount;

            // Tạo đối tượng kết quả để trả về
            const response = {
              status: 200,
              message: "Get Product by category success",
              Products: data,
              pagination: {
                currentPage: page,
                pageSize: pageSize || 0,
                totalPages: Math.ceil(totalCount / pageSize) || 0,
                totalCount: totalCount,
              },
            };

            resolve(response);
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

module.exports = {
  createProduct,
  UpdateProduct,
  DeleteProduct,
  GetAllProduct,
  GetByIdProduct,
  GetByCategory,
};
