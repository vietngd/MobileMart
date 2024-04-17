const UserController = require("../controllers/UserController.js");
const express = require("express");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware.js");
const checkExistence = require("../middleware/checkExistMiddleware.js");

const router = express.Router();

// Kiểm tra điều kiện tồn tại

router.post(
  "/sign-up",
  checkExistence("users", "email"),
  UserController.createUser
);
router.post("/sign-in", UserController.loginUser);
router.put("/update-user/:id", UserController.updateUser);
router.delete("/delete-user/:id", authMiddleware, UserController.deleteUser);
router.get("/getAllUser", authMiddleware, UserController.getAllUser);
router.get(
  "/getDetailUser/:id",
  authUserMiddleware,
  UserController.getDetailUser
);
router.get("/refresh-token", UserController.refreshToken);

module.exports = router;
