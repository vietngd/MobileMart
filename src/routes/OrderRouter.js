const OrderController = require("../controllers/OrderController.js");
const express = require("express");
const { authUserMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/create", authUserMiddleware, OrderController.createOrder);
router.get("/getAll", OrderController.getAllOrder);

module.exports = router;
