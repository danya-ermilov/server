import express from "express";
import NewsController from "../controllers/News.js";
import adminMiddlware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new express.Router();

router.post("/create", authMiddleware, adminMiddlware, NewsController.create);
router.get("/get", NewsController.get);

router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddlware,
  NewsController.delete
);

router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddlware,
  NewsController.update
);
export default router;
