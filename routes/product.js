import express from "express";
import ProductController from "../controllers/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import productMiddleware from "../middleware/productMiddleware.js";

const router = new express.Router();

// список товаров выбранной категории и выбранного бренда
router.get(
  "/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)",
  ProductController.getAll
);
// список товаров выбранной категории
router.get("/getall/categoryId/:categoryId([0-9]+)", ProductController.getAll);
// список товаров выбранного бренда
router.get("/getall/brandId/:brandId([0-9]+)", ProductController.getAll);
//списиок товаров выбранного автора
router.get("/getall/userId/:userId([0-9]+)", ProductController.getAll);
// список всех товаров каталога
router.get("/getall", ProductController.getAll);
// получить один товар каталога
router.get("/getone/:id([0-9]+)", ProductController.getOne);
// создать товар каталога — нужны права администратора
router.post("/create", authMiddleware, ProductController.create);
// обновить товар каталога  — нужны права администратора
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  productMiddleware,
  ProductController.update
);
// удалить товар каталога  — нужны права администратора
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  productMiddleware,
  ProductController.delete
);

router.get("/download/:id([0-9]+)", ProductController.download_zip);

export default router;
