const CommentController = require("../controllers/CommentController");
const express = require("express");

const router = express.Router();

router.post("/create", CommentController.CreateComment);
router.get("/getAllComment", CommentController.GetAllComment);
router.post("/reply-comment", CommentController.ReplyComment);
router.delete("/delete/:id", CommentController.DeleteComment);

module.exports = router;
