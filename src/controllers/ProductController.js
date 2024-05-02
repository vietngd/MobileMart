const ProductServices = require("../services/ProductServices.js");

const createProduct = async (req, res) => {
  try {
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
    } = req.body;

    if (
      !name ||
      !description ||
      hot === null ||
      !price ||
      !sale ||
      !quantity ||
      !category_id ||
      !configuration ||
      !images
    ) {
      return res.status(200).json({
        status: "Err",
        message: "The input is required",
      });
    }
    const response = await ProductServices.createProduct(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const UpdateProduct = async (req, res) => {
  try {
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
    } = req.body;
    if (
      !name ||
      !description ||
      hot === null ||
      !price ||
      !sale ||
      !quantity ||
      !category_id ||
      !configuration ||
      !images
    ) {
      return res.status(200).json({
        status: "Err",
        message: "The input is required",
      });
    }

    const productId = req.params.id;
    const response = await ProductServices.UpdateProduct(req.body, productId);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const ProductId = req.params.id;
    const response = await ProductServices.DeleteProduct(ProductId);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const GetAllProduct = async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder, productName } = req.query;
    const PageSize = parseInt(pageSize) || 5;
    const Page = parseInt(page) || 1;

    const response = await ProductServices.GetAllProduct(
      Page,
      PageSize,
      sortField,
      sortOrder,
      productName
    );

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const GetByIdProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await ProductServices.GetByIdProduct(productId);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};

const GetByCategory = async (req, res) => {
  try {
    const categorytId = req.params.categoryId;
    const { page, pageSize, sortField, sortOrder } = req.query;
    const PageSize = parseInt(pageSize) || 5;
    const Page = parseInt(page) || 1;
    const response = await ProductServices.GetByCategory(
      categorytId,
      Page,
      PageSize,
      sortField,
      sortOrder
    );
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
module.exports = {
  createProduct,
  UpdateProduct,
  DeleteProduct,
  GetAllProduct,
  GetByIdProduct,
  GetByCategory,
};
