const connection = require("../config/ConnectDB.js");
const RandomID = require("../config/randomID.js");

const createProduct = (newProduct) => {
  return new Promise((resolve, reject) => {
    const { product, configuration, images } = newProduct;

    const id = RandomID(25);
    try {
      const sqlProduct =
        "INSERT INTO products (id,name,images,hot,price,sale,quantity,category_id) VALUES (? , ? , ? , ? , ? , ? , ? , ?)";
      const imagesString = images?.join(",");
      connection.query(
        sqlProduct,
        [
          id,
          product?.name,
          imagesString,
          product?.hot,
          product?.price,
          product?.sale,
          product?.quantity,
          product?.category_id,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Thêm sản phẩm thất bại",
              err,
            });
          } else {
            const sqlConfiguration = `INSERT INTO configuration (product_id, after_camera, battery , before_camera, chipset, operating_system, ram, screen_resolution, screen_size, screen_technology, storage ) VALUES (?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(
              sqlConfiguration,
              [
                id,
                configuration?.after_camera,
                configuration?.battery,
                configuration?.before_camera,
                configuration?.chipset,
                configuration?.operating_system,
                configuration?.ram,
                configuration?.screen_resolution,
                configuration?.screen_size,
                configuration?.screen_technology,
                configuration?.storage,
              ],
              (err, data) => {
                if (err) {
                  console.log(err);
                  resolve({
                    status: "Err",
                    message: "Thêm cấu hình thất bại",
                  });
                }

                resolve({
                  status: "OK",
                  message: "Thêm sản phẩm thành công",
                });
              }
            );
          }
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
    const { product, configuration, images } = newProduct;

    try {
      const sqlProduct =
        "UPDATE products SET  name = ? , images = ? , hot = ? , price =?, sale =? , quantity = ? , category_id = ? WHERE id = ?";
      const imagesString = images?.join(",");
      connection.query(
        sqlProduct,
        [
          product?.name,
          imagesString,
          product?.hot,
          product?.price,
          product?.sale,
          product?.quantity,
          product?.category_id,
          ProductId,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Cập nhật sản phẩm thất bại",
              err,
            });
          } else {
            const sqlConfiguration = `UPDATE configuration SET after_camera = ? ,battery = ? ,before_camera = ? ,chipset = ? ,operating_system = ? ,ram = ? ,screen_resolution = ? ,screen_size = ? ,screen_technology = ? ,storage = ?  WHERE product_id = ?`;
            connection.query(
              sqlConfiguration,
              [
                configuration?.after_camera,
                configuration?.battery,
                configuration?.before_camera,
                configuration?.chipset,
                configuration?.operating_system,
                configuration?.ram,
                configuration?.screen_resolution,
                configuration?.screen_size,
                configuration?.screen_technology,
                configuration?.storage,
                ProductId,
              ],
              (err, data) => {
                if (err) {
                  console.log(err);
                  resolve({
                    status: "Err",
                    message: "Cập nhật cấu hình thất bại",
                    err,
                  });
                }

                resolve({
                  status: "OK",
                  message: "Cập nhật sản phẩm thành công",
                  data: data,
                });
              }
            );
          }
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
      connection.query(
        "DELETE FROM products WHERE id = ? ",
        [ProductId],
        (err, result) => {
          if (err) {
            console.log(err);
            resolve({
              status: "Err",
              message: "Delete Product Fail",
            });
          } else {
            resolve({
              status: "OK",
              message: "Delete Product success",
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

const GetAllProduct = (page, pageSize, sortField, sortOrder, productName) => {
  return new Promise((resolve, reject) => {
    try {
      // Tính chỉ số bắt đầu và số lượng sản phẩm để trả về trên trang hiện tại
      let startIndex = 0;
      if (pageSize) {
        startIndex = (page - 1) * parseInt(pageSize);
      }

      let sql = "SELECT * FROM products WHERE 1=1";

      if (productName) {
        sql += ` AND name LIKE '%${productName}%'`;
      }
      // Xử lý sort
      if (sortField && sortOrder) {
        sql += ` ORDER BY ${sortField} ${sortOrder}`;
      }

      // Thêm phân trang
      if (pageSize) {
        sql += ` LIMIT ${startIndex}, ${parseInt(pageSize)}`;
      }

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

            const totalCount = result[0]?.totalCount;

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
      connection.query(sql, [ProductId], (err, product) => {
        if (err) {
          console.log(err);
          resolve({
            status: 200,
            message: "Get detail product fail",
            err,
          });
        } else {
          const sqlConfiguration = `SELECT * FROM configuration WHERE product_id = ?`;

          connection.query(sqlConfiguration, [ProductId], (err, config) => {
            if (err) {
              console.log(err);
              resolve({
                status: 200,
                message: "Get configuration product fail",
                err,
              });
            } else {
              const data = {
                ...product,
                config,
              };
              resolve({
                status: 200,
                message: "Get detail product success",
                data,
              });
            }
          });
        }
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

            const totalCount = result[0]?.totalCount;

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
