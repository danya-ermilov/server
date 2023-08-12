import NewsModel from "../models/News.js";
import AppError from "../errors/AppError.js";

class News {
  async get(req, res, next) {
    try {
      const news = await NewsModel.getOne();
      res.json(news);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      //const { text } = req.body;
      //const { productId } = req.params;
      const news = await NewsModel.create(req.body.text);
      res.json(news);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No news id specified");
      }
      const news = await NewsModel.delete(req.params.id);
      res.json(news);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No news id specified");
      }
      const news = await NewsModel.update(req.params.id, req.body.text);
      res.json(news);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new News();
