const ProductController = require("../controllers/ProductController.js");
const express = require("express");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware.js");
const checkExistence = require("../middleware/checkExistMiddleware.js");
const UploadImageMiddleware = require("../middleware/UploadImage.js");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  UploadImageMiddleware(),
  ProductController.createProduct
);
router.put(
  "/update/:id",
  authMiddleware,
  UploadImageMiddleware(),
  ProductController.UpdateProduct
);
router.delete("/delete/:id", authMiddleware, ProductController.DeleteProduct);
router.get("/getAll", ProductController.GetAllProduct);
router.get("/getById/:id", ProductController.GetByIdProduct);
// Get sản phẩm theo id danh mục
router.get("/getAll/:categoryId", ProductController.GetByCategory);

module.exports = router;
