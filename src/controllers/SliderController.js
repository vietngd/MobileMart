const SliderServices = require("../services/SliderServices.js");

const createSlider = async (req, res) => {
  try {
    const { sliders } = req.body;
    if (!sliders) {
      return res.status(200).json({
        status: "Err",
        message: "Chưa truyền tham số sliders",
      });
    }
    const response = await SliderServices.createSlider(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
const getAllSlider = async (req, res) => {
  try {
    const response = await SliderServices.getAllSlider();
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: "Err",
        message: "Chưa truyền tham số id cần xóa",
      });
    }
    const response = await SliderServices.deleteSlider(id);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
module.exports = {
  createSlider,
  getAllSlider,
  deleteSlider,
};
