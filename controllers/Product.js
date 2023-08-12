import ProductModel from "../models/Product.js";
import AppError from "../errors/AppError.js";
import RatingModel from "../models/Rating.js";
import fs from "fs";
import { log } from "console";
import path from "path";

class Product {
  async getAll(req, res, next) {
    try {
      const { categoryId = null, brandId = null, userId = null } = req.params;
      let { limit, page, name, sort } = req.query;
      //console.log(sort);
      limit =
        limit && /[0-9]+/.test(limit) && parseInt(limit) ? parseInt(limit) : 3;
      page = page && /[0-9]+/.test(page) && parseInt(page) ? parseInt(page) : 1;
      const options = { categoryId, brandId, userId, limit, page, name, sort };
      const products = await ProductModel.getAll(options);
      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No product id specified");
      }
      const product = await ProductModel.getOne(req.params.id);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    //console.log("ok");
    try {
      //console.log("ok");
      const product = await ProductModel.create(
        req.body,
        req.files?.image,
        req.files?.pdf_file,
        req.files?.zip_file,
        req.auth.id
      );
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No product id specified");
      }
      const product = await ProductModel.update(
        req.params.id,
        req.body,
        req.files?.image,
        req.files?.pdf_file,
        req.files?.zip_file
      );
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No product id specified");
      }
      const product = await ProductModel.delete(req.params.id);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async download_zip(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No product id specified");
      }
      const product = await ProductModel.getOne(req.params.id);
      const zipFilePath = path.resolve("static", product.zip_file); // Здесь должен быть путь к файлу в вашей базе данных

      if (!fs.existsSync(zipFilePath)) {
        res.status(404).send("Файл не найден!");
        return;
      }
      // Устанавливаем заголовки для скачивания файла
      return res.download(zipFilePath, product.name);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Product();
