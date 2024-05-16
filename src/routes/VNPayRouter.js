const VNPayController = require("../controllers/VNPayController");
const express = require("express");
const { authUserMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create_payment_url", VNPayController.create_payment_url);

module.exports = router;
