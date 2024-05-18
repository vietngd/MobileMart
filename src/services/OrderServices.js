const { data } = require("jquery");
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
                orders.id`;

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

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT orders.id, orders.name , orders.address, users.phone , orders.note, orders.total_money , orders.order_status_payment,orders.order_status_transport,orders.order_status_cancel , orders.created_at FROM
      orders JOIN users ON orders.user_id = users.id`;

      connection.query(sql, [], (err, result) => {
        if (err) {
          console.log("Err khi getAllOrder =>>", err);
          resolve({
            status: "Err",
            message: "Get all order fail",
          });
        }

        resolve({
          status: "OK",
          message: "Get all order success",
          data: result,
        });
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
      const sqlDeletOrder = `DELETE FROM orders WHERE id = ?`;
      connection.query(sqlDeletOrder, [order_id], (err, data) => {
        if (err) {
          console.log("Err khi delete order =>>", err);
          resolve({
            status: "Err",
            message: "Delete order fail",
          });
        } else {
          resolve({
            status: "OK",
            message: "Delete order success",
          });
        }
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
