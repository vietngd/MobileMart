const UserController = require("../controllers/UserController.js");
const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.loginUser);
router.put("/update-user/:id", UserController.updateUser);
router.delete("/delete-user/:id", authMiddleware, UserController.deleteUser);
router.get("/getAllUser", authMiddleware, UserController.getAllUser);
router.get("/getDetailUser/:id", authMiddleware, UserController.getDetailUser);

module.exports = router;
