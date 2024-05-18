const OrderController = require("../controllers/OrderController.js");
const express = require("express");
const {
  authUserMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/create", authUserMiddleware, OrderController.createOrder);
router.get("/getOrderByUser", OrderController.getOrderByUser);
router.get("/getAllOrder", authMiddleware, OrderController.getAllOrder);
router.get(
  "/getDetailOrder/:id",
  authMiddleware,
  OrderController.getDetailOrder
);

router.put(
  "/update-transport/:id",
  authMiddleware,
  OrderController.updateTransport
);

router.delete("/delete/:id", authMiddleware, OrderController.deleteOrder);
router.get("/statistical", authMiddleware, OrderController.statisticalOrder);
router.delete("/cancel/:id", authUserMiddleware, OrderController.cancelOrder);

module.exports = router;
