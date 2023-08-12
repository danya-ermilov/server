import express from "express";
import RatingController from "../controllers/Rating.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new express.Router();

router.get("/product/:productId([0-9]+)", RatingController.getOne);
router.post(
  "/product/:productId([0-9]+)/rate/:rate([1-5])",
  authMiddleware,
  RatingController.create
);
router.get("/:productId([0-9]+)", authMiddleware, RatingController.get);

router.delete(
  "/product/:productId([0-9]+)/delete",
  authMiddleware,
  RatingController.delete
);
/*
router.post(
  "/product/:productId([0-9]+)/rate/update/:rate([1-5])",
  authMiddleware,
  RatingController.update
);
*/
export default router;
