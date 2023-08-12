import express from "express";
import CommentController from "../controllers/Comment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import commentMiddleware from "../middleware/commentMiddleware.js";

const router = new express.Router();

router.post(
  "/product/:productId([0-9]+)/create",
  authMiddleware,
  CommentController.create
);
router.get(
  "/product/:productId([0-9]+)/get",
  authMiddleware,
  CommentController.get
);

router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  commentMiddleware,
  CommentController.delete
);

router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  commentMiddleware,
  CommentController.update
);
export default router;
