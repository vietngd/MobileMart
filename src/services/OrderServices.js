const connection = require("../config/ConnectDB.js");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        user_id,
        address,
        note = "",
        products,
        order_status_payment,
      } = newOrder;

      connection.query(
        "INSERT INTO orders (user_id, address, note, order_status_payment) VALUES (?, ?, ?, ?)",
        [user_id, address, note, order_status_payment],
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
                "INSERT INTO order_detail (order_id, product_id, quantity) VALUES (?, ?, ?)",
                [order_id, product?.product_id, product?.quantity],
                function (error) {
                  if (error) {
                    console.log("Lỗi khi thực hiện add order detailt:", error);
                    resolve({
                      status: "Err",
                      message: "Add order detail Fail",
                      err,
                    });
                  }

                  resolve({
                    status: "OK",
                    message: "Add order success",
                  });
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

const getAllOrder = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user_id } = user;

      const sql = `
            SELECT 
                users.name,
                orders.address, 
                orders.id AS order_id, 
                orders.order_status_payment, 
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
                users ON orders.user_id = users.id
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

module.exports = {
  createOrder,
  getAllOrder,
};
