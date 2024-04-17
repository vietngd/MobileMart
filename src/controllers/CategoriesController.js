const CategoryServices = require("../services/CategoriesServices.js");
const JwtServices = require("../services/JwtServices.js");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(200).json({
        status: "Err",
        message: "The input is required",
      });
    }
    const response = await CategoryServices.createCategory(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const UpdateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;
    if (!name || !description) {
      return res.status(200).json({
        status: "Err",
        message: "The input is required",
      });
    }
    const response = await CategoryServices.UpdateCategory(
      req.body,
      categoryId
    );
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const response = await CategoryServices.DeleteCategory(categoryId);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const GetAllCategory = async (req, res) => {
  try {
    const response = await CategoryServices.GetAllCategory();
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

module.exports = {
  createCategory,
  UpdateCategory,
  DeleteCategory,
  GetAllCategory,
};
