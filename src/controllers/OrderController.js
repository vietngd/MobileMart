const OrderServices = require("../services/OrderServices");

const createOrder = async (req, res) => {
  try {
    const { address, order_status_payment, products, user_id } = req.body;

    if (!address) {
      return res.status(200).json({
        status: "Err",
        message: "Address không được để trống",
      });
    }
    if (order_status_payment === null) {
      return res.status(200).json({
        status: "Err",
        message: "Thiếu phương thức thanh toán",
      });
    }

    if (products.length <= 0) {
      return res.status(200).json({
        status: "Err",
        message: "Không có sản phẩm nào được chọn mua",
      });
    }

    if (!user_id) {
      return res.status(200).json({
        status: "Err",
        message: "The authentication",
      });
    }

    const response = await OrderServices.createOrder(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(200).json({
        status: "Err",
        message: "Thiếu user_id",
      });
    }
    const response = await OrderServices.getAllOrder(req.query);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrder,
};
