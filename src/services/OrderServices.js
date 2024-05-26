const connection = require("../config/ConnectDB.js");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        user_id,
        address,
        note = "",
        total_money,
        products,
        order_status_payment,
        name,
        phone,
      } = newOrder;

      connection.query(
        "INSERT INTO orders (user_id, address, note,total_money , order_status_payment , name , phone) VALUES (?, ?, ? , ?, ? , ?, ?)",
        [
          user_id,
          address,
          note,
          total_money,
          order_status_payment,
          name,
          phone,
        ],
        function (error, results) {
          if (error) {
            console.log("Lỗi khi thực hiện add order:", error);
            resolve({
              status: "Err",
              message: "Add order Fail",
              err,
            });
          } else {
            const order_id = results.insertId;
            for (const product of products) {
              connection.query(
                "INSERT INTO order_detail (order_id, product_id, quantity , price) VALUES (?, ?, ? , ?)",
                [
                  order_id,
                  product?.product_id,
                  product?.quantity,
                  product?.price,
                ],
                function (error) {
                  if (error) {
                    console.log("Lỗi khi thực hiện add order detailt:", error);
                    resolve({
                      status: "Err",
                      message: "Add order detail Fail",
                      err,
                    });
                  } else {
                    connection.query(
                      `UPDATE products SET total_pay = total_pay + ${product?.quantity} , quantity = quantity - ${product?.quantity} WHERE id = "${product?.product_id}"`
                    );
                    resolve({
                      status: "OK",
                      message: "Add order success",
                    });
                  }
                }
              );
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const getOrderByUser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user_id } = user;

      const sql = `
            SELECT 
                orders.name,
                orders.address, 
                orders.id AS order_id, 
                orders.order_status_payment, 
                orders.order_status_transport, 
                orders.order_status_cancel, 
                orders.total_money,
                orders.created_at,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'name', products.name,
                            'images', products.images,
                            'sale', products.sale,
                            'price', products.price,
                            'quantity', order_detail.quantity
                        )
                        SEPARATOR ','
                    ),
                    ']'
                ) AS products
            FROM 
                orders
            JOIN 
                order_detail ON orders.id = order_detail.order_id
            JOIN 
                products ON order_detail.product_id = products.id
            WHERE 
                orders.user_id = ?
            GROUP BY 
                orders.id
            ORDER BY orders.created_at DESC
                `;

      connection.query(sql, [user_id], function (error, results) {
        if (error) {
          console.log("Lỗi khi thực hiện get all order:", error);
          resolve({
            status: "Err",
            message: "Get all order Fail",
            err,
          });
        } else {
          if (results.length === 0) {
            resolve({
              status: "OK",
              message: "Người dùng này chưa đặt đơn hàng nào",
            });
          } else {
            resolve({
              status: "OK",
              message: "Get all order success",
              data: results,
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
const getAllOrder = (Page, PageSize, order_id) => {
  if (PageSize) {
    PageSize = parseInt(PageSize);
  }
  const startIndex = (Page - 1) * PageSize; // Tính startIndex cho trang hiện tại

  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT orders.id, orders.name, orders.address, users.phone, orders.note, orders.total_money, orders.order_status_payment, orders.order_status_transport, orders.order_status_cancel, orders.created_at 
                 FROM orders 
                 JOIN users ON orders.user_id = users.id 
                 `;

      if (order_id) {
        sql += `WHERE orders.id = ${order_id} `;
      }
      sql += `ORDER BY orders.created_at DESC`;
      let params = [];
      if (PageSize && PageSize > 0) {
        sql += ` LIMIT ?, ?`;
        params = [startIndex, PageSize];
      }

      connection.query(sql, params, (err, orders) => {
        if (err) {
          console.log("Err khi getAllOrder =>>", err);
          resolve({
            status: "Err",
            message: "Get all orders fail",
          });
        } else {
          // Truy vấn tổng số lượng orders
          connection.query(
            "SELECT COUNT(*) AS totalCount FROM orders",
            [],
            (err, data) => {
              if (err) {
                console.log("Err khi tính tổng số lượng orders =>>", err);
                resolve({
                  status: "Err",
                  message: "Total orders fail",
                });
              } else {
                const totalCount = data[0].totalCount;

                const response = {
                  status: "OK",
                  message: "Get all orders success",
                  data: orders,
                  pagination: {
                    currentPage: Page,
                    pageSize: PageSize || totalCount, // Nếu không có PageSize, set PageSize bằng tổng số lượng orders
                    totalPages: PageSize ? Math.ceil(totalCount / PageSize) : 1,
                    totalCount: totalCount,
                  },
                };
                resolve(response);
              }
            }
          );
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const getDetailOrder = (order_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `
            SELECT 
                users.name,
                users.phone,
                orders.address,
                orders.note,
                orders.created_at,
                orders.total_money,
                orders.id AS order_id,
                orders.order_status_payment, 
                orders.order_status_transport,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'name', products.name,
                            'images', products.images,
                            'price', order_detail.price,
                            'quantity', order_detail.quantity
                        )
                        SEPARATOR ','
                    ),
                    ']'
                ) AS products
            FROM 
                orders
            JOIN 
                users ON orders.user_id = users.id
            JOIN 
                order_detail ON orders.id = order_detail.order_id
            JOIN 
                products ON order_detail.product_id = products.id
            WHERE 
               orders.id = ?`;

      connection.query(sql, [order_id], (err, result) => {
        if (err) {
          console.log("Err khi getDetailOrder =>>", err);
          resolve({
            status: "Err",
            message: "Get detail order fail",
          });
        }

        resolve({
          status: "OK",
          message: "Get Detail order success",
          data: result,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const updateTransport = (order_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE orders SET order_status_transport = 1 WHERE id = ?`;

      connection.query(sql, [order_id], (err, result) => {
        if (err) {
          console.log("Err khi getDetailOrder =>>", err);
          resolve({
            status: "Err",
            message: "Update transport fail",
          });
        }

        resolve({
          status: "OK",
          message: "Update transport success",
          data: result,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const deleteOrder = (order_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Bắt đầu transaction
      connection.beginTransaction((err) => {
        if (err) {
          console.log("Err khi bắt đầu transaction =>>", err);
          return resolve({
            status: "Err",
            message: "Transaction start fail",
          });
        }

        // Lấy chi tiết đơn hàng
        connection.query(
          "SELECT product_id, quantity FROM order_detail WHERE order_id = ?",
          [order_id],
          (err, order_detail) => {
            if (err) {
              console.log("Lỗi khi lấy chi tiết đơn hàng =>>", err);
              return connection.rollback(() => {
                resolve({
                  status: "Err",
                  message: "Get order_detail fail",
                });
              });
            }

            // Cập nhật số lượng sản phẩm
            const updateProductQuantity = order_detail.map((item) => {
              return new Promise((resolve, reject) => {
                connection.query(
                  "UPDATE products SET quantity = quantity + ? , total_pay = total_pay - ? WHERE id = ?",
                  [item.quantity, item.quantity, item.product_id],
                  (err) => {
                    if (err) {
                      return reject(err);
                    }
                    resolve();
                  }
                );
              });
            });

            Promise.all(updateProductQuantity)
              .then(() => {
                // Xóa đơn hàng sau khi cập nhật số lượng sản phẩm
                connection.query(
                  "DELETE FROM orders WHERE id = ?",
                  [order_id],
                  (err) => {
                    if (err) {
                      console.log("Lỗi khi xóa đơn hàng =>>", err);
                      return connection.rollback(() => {
                        resolve({
                          status: "Err",
                          message: "Delete order fail",
                        });
                      });
                    }

                    // Commit transaction nếu không có lỗi
                    connection.commit((err) => {
                      if (err) {
                        console.log("Lỗi khi commit transaction =>>", err);
                        return connection.rollback(() => {
                          resolve({
                            status: "Err",
                            message: "Commit transaction fail",
                          });
                        });
                      }

                      resolve({
                        status: "OK",
                        message: "Delete order success",
                      });
                    });
                  }
                );
              })
              .catch((err) => {
                console.log("Lỗi khi cập nhật số lượng sản phẩm =>>", err);
                connection.rollback(() => {
                  resolve({
                    status: "Err",
                    message: "Update product quantity fail",
                  });
                });
              });
          }
        );
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const statisticalOrder = (order_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT 
          c.id AS category_id,
          c.name AS category_name,
          SUM(od.quantity) AS total_quantity_sold
        FROM 
            categories c
        JOIN 
            products p ON c.id = p.category_id
        JOIN 
            order_detail od ON p.id = od.product_id
        GROUP BY 
            c.id, c.name;`;

      connection.query(sql, [], (err, result) => {
        if (err) {
          console.log("Err khi Thống kê order =>>", err);
          resolve({
            status: "Err",
            message: "Thống kê order fail",
          });
        } else {
          resolve({
            status: "OK",
            message: "Thống kê order success",
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
const cancelOrder = (order_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE orders SET order_status_cancel = true WHERE id = ?`;

      connection.query(sql, [order_id], (err, result) => {
        if (err) {
          console.log("Err khi cancel order =>>", err);
          resolve({
            status: "Err",
            message: "Cancel order fail",
          });
        } else {
          resolve({
            status: "OK",
            message: "Cancel order success",
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
  createOrder,
  getOrderByUser,
  getAllOrder,
  getDetailOrder,
  updateTransport,
  deleteOrder,
  statisticalOrder,
  cancelOrder,
};
