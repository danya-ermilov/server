import express from "express";
import BasketController from "../controllers/Basket.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new express.Router();

router.get("/getone", authMiddleware, BasketController.getOne);
router.put(
  "/product/:productId([0-9]+)/append",
  authMiddleware,
  BasketController.append
);
router.put(
  "/product/:productId([0-9]+)/remove",
  authMiddleware,
  BasketController.remove
);
router.put("/clear", authMiddleware, BasketController.clear);

export default router;
