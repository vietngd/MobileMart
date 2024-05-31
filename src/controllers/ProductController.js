const ProductServices = require("../services/ProductServices.js");

const createProduct = async (req, res) => {
  try {
    const { product, configuration } = req.body;

    if (
      !product?.category_id ||
      !product?.name ||
      !product?.images ||
      !product?.price ||
      !product?.quantity ||
      !product?.sale
    ) {
      return res.status(200).json({
        status: "Err",
        message: "Thông tin của product bị thiếu",
      });
    }

    if (
      !configuration?.after_camera ||
      !configuration?.battery ||
      !configuration?.before_camera ||
      !configuration?.chipset ||
      !configuration?.operating_system ||
      !configuration?.ram ||
      !configuration?.screen_resolution ||
      !configuration?.screen_size ||
      !configuration?.screen_technology ||
      !configuration?.storage
    ) {
      return res.status(200).json({
        status: "Err",
        message: "Thông tin của configuration bị thiếu",
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
    const { product, configuration } = req.body;

    if (
      !product?.category_id ||
      !product?.name ||
      !product?.images ||
      !product?.price ||
      !product?.quantity ||
      !product?.sale
    ) {
      return res.status(200).json({
        status: "Err",
        message: "Thông tin của product bị thiếu",
      });
    }

    if (
      !configuration?.after_camera ||
      !configuration?.battery ||
      !configuration?.before_camera ||
      !configuration?.chipset ||
      !configuration?.operating_system ||
      !configuration?.ram ||
      !configuration?.screen_resolution ||
      !configuration?.screen_size ||
      !configuration?.screen_technology ||
      !configuration?.storage
    ) {
      return res.status(200).json({
        status: "Err",
        message: "Thông tin của configuration bị thiếu",
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
    const Page = parseInt(page) || 1;

    const response = await ProductServices.GetAllProduct(
      Page,
      pageSize,
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

    const PageSize = pageSize && parseInt(pageSize);
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
