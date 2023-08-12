import RatingModel from "../models/Rating.js";
import AppError from "../errors/AppError.js";

class Rating {
  async get(req, res, next) {
    try {
      const rate = await RatingModel.get(req.params.productId, req.auth.id);
      res.json(rate);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const rating = await RatingModel.getOne(req.params.productId);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const { productId, rate } = req.params;
      const rating = await RatingModel.create(req.auth.id, productId, rate);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { productId } = req.params;
      const rating = await RatingModel.delete(req.auth.id, productId);
      res.json(rating);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Rating();
