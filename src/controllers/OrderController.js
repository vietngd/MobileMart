const OrderServices = require("../services/OrderServices");

const createOrder = async (req, res) => {
  try {
    const {
      address,
      order_status_payment,
      products,
      user_id,
      phone,
      total_money,
    } = req.body;

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
        message: "Thiếu user_id",
      });
    }

    const regexPhoneNumber = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!regexPhoneNumber.test(phone)) {
      return res.status(200).json({
        status: "Err",
        message: "Vui lòng nhập đúng số điện thoại",
      });
    }

    if (!total_money) {
      return res.status(200).json({
        status: "Err",
        message: "Total_money không được để trống",
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

const getOrderByUser = async (req, res) => {
  try {
    const { user_id, is_received } = req.query;
    if (!user_id) {
      return res.status(200).json({
        status: "Err",
        message: "User_id is required",
      });
    }
    if (!is_received) {
      return res.status(200).json({
        status: "Err",
        message: "is_received is required",
      });
    }
    const response = await OrderServices.getOrderByUser(req.query);
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
    const { page, pageSize, order_id } = req.query;
    const Page = parseInt(page) || 1;
    const response = await OrderServices.getAllOrder(Page, pageSize, order_id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const getDetailOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: "Err",
        message: "Thiếu id của đơn hàng",
      });
    }
    const response = await OrderServices.getDetailOrder(id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
const updateTransport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: "Err",
        message: "Thiếu id của đơn hàng",
      });
    }

    const response = await OrderServices.updateTransport(id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: "Err",
        message: "Thiếu id của đơn hàng",
      });
    }

    const response = await OrderServices.deleteOrder(id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
const statisticalOrder = async (req, res) => {
  try {
    const response = await OrderServices.statisticalOrder();
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: "Err",
        message: "Thiếu order_id",
      });
    }
    const response = await OrderServices.cancelOrder(id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
const updateIsReceived = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: "Err",
        message: "Thiếu order_id",
      });
    }
    const response = await OrderServices.updateIsReceived(id);
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
  getOrderByUser,
  getAllOrder,
  getDetailOrder,
  updateTransport,
  deleteOrder,
  statisticalOrder,
  cancelOrder,
  updateIsReceived,
};
