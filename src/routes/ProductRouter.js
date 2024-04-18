const ProductController = require("../controllers/ProductController.js");
const express = require("express");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware.js");
const checkExistence = require("../middleware/checkExistMiddleware.js");

const router = express.Router();

router.post("/create", ProductController.createProduct);
router.put("/update/:id", ProductController.UpdateProduct);
router.delete("/delete/:id", ProductController.DeleteProduct);
router.get("/getAll", ProductController.GetAllProduct);
router.get("/getById/:id", ProductController.GetByIdProduct);

module.exports = router;
