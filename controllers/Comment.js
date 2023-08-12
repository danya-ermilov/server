import CommentModel from "../models/Comment.js";
import AppError from "../errors/AppError.js";

class Comment {
  async get(req, res, next) {
    try {
      const comment = await CommentModel.get(req.params.productId);
      res.json(comment);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async create(req, res, next) {
    try {
      console.log(req.params, req.auth.id, req.body);
      //const { text } = req.body;
      //const { productId } = req.params;
      const comment = await CommentModel.create(
        req.params.productId,
        req.auth.id,
        req.body.text
      );
      res.json(comment);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No comment id specified");
      }
      const comment = await CommentModel.delete(req.params.id);
      res.json(comment);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("No comment id specified");
      }
      const product = await CommentModel.update(req.params.id, req.body.text);
      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  }
}

export default new Comment();
