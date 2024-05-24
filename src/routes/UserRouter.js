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
router.post("/logout", UserController.logoutUser);
router.put("/update/:id", authUserMiddleware, UserController.updateUser);
router.delete("/delete/:id", authMiddleware, UserController.deleteUser);
router.get("/getAllUser", authMiddleware, UserController.getAllUser);
router.get(
  "/getDetailUser/:id",
  authUserMiddleware,
  UserController.getDetailUser
);
router.post("/refresh-token", UserController.refreshToken);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/verify-forgot-password", UserController.verifyForgotPassword);
router.put("/update-password", UserController.updatePassword);

module.exports = router;
