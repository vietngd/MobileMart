const SliderController = require("../controllers/SliderController.js");
const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const UploadImageMiddleware = require("../middleware/UploadImage.js");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  UploadImageMiddleware(),
  SliderController.createSlider
);
router.get("/getAll", SliderController.getAllSlider);
router.delete("/delete/:id", authMiddleware, SliderController.deleteSlider);

module.exports = router;
