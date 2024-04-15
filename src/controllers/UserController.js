const UserServices = require("../services/UserServices.js");

// Tạo tài khoản
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = regEmail.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "Err",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "Err",
        message: "The input is not email",
      });
    }

    const response = await UserServices.createUser(req.body);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(404).json({
      message: err,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = regEmail.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "Err",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "Err",
        message: "The input is not email",
      });
    }

    const response = await UserServices.loginUser(req.body);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(404).json({
      message: err,
    });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const response = await UserServices.updateUser(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await UserServices.deleteUser(userId);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserServices.getAllUser();
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await UserServices.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

module.exports = {
  getAllUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getDetailUser,
};
